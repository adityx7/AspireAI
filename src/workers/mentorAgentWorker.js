const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const { connection } = require('../services/queueService');
const { generateAIInsight } = require('../services/aiService');
const MentorSuggestion = require('../models/MentorSuggestion');
const AgentJob = require('../models/AgentJob');
const Notification = require('../models/Notification');

// Import student model (adjust path as needed)
let Student;
try {
  Student = require('../models/Student');
} catch (e) {
  // Fallback if model path is different
  console.warn('⚠️  Student model not found at expected path, will need to import manually');
}

/**
 * Load comprehensive student data
 */
async function loadStudentData(userId) {
  console.log(`📊 Loading student data for ${userId}`);
  
  if (!Student) {
    throw new Error('Student model not available');
  }

  const student = await Student.findOne({ usn: userId }).lean();
  
  if (!student) {
    throw new Error(`Student not found: ${userId}`);
  }

  // Load related data
  const recentSuggestions = await MentorSuggestion.find({
    userId,
    generatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  }).sort({ generatedAt: -1 }).limit(5).lean();

  return {
    student,
    recentSuggestions
  };
}

/**
 * Perform rule-based quick checks
 */
function performRuleChecks(student) {
  const flags = [];
  const academics = student.academics || {};
  
  // Check attendance
  const attendance = academics.attendance || 0;
  if (attendance < 75) {
    flags.push({
      type: 'attendance',
      severity: attendance < 65 ? 'high' : 'medium',
      message: `Low attendance: ${attendance}%`
    });
  }

  // Check CGPA drop
  const semesters = academics.semesters || [];
  if (semesters.length >= 2) {
    const latest = semesters[semesters.length - 1];
    const previous = semesters[semesters.length - 2];
    const cgpaDrop = previous.cgpa - latest.cgpa;
    
    if (cgpaDrop > 0.3) {
      flags.push({
        type: 'cgpa_drop',
        severity: cgpaDrop > 0.5 ? 'high' : 'medium',
        message: `CGPA dropped by ${cgpaDrop.toFixed(2)} points`
      });
    }
  }

  // Check activity points
  const activityPoints = student.aicteActivityPoints || [];
  const recentActivity = activityPoints.filter(ap => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return new Date(ap.date) > sixMonthsAgo;
  });

  if (recentActivity.length === 0) {
    flags.push({
      type: 'no_activity',
      severity: 'low',
      message: 'No AICTE activity points in last 6 months'
    });
  }

  // Check internal marks
  const internalMarks = academics.internalMarks || [];
  const recentInternals = internalMarks.filter(im => {
    const currentSemester = semesters[semesters.length - 1]?.semester || 1;
    return im.semester === currentSemester;
  });

  const lowScoring = recentInternals.filter(im => {
    const avgIA = (im.ia1 + im.ia2 + im.ia3) / 3;
    return avgIA < 15; // Less than 50% average
  });

  if (lowScoring.length > 0) {
    flags.push({
      type: 'low_ia',
      severity: 'medium',
      message: `${lowScoring.length} subjects with low IA marks`
    });
  }

  return flags;
}

/**
 * Normalize student data for LLM
 */
function normalizeStudentData(studentData, ruleFlags) {
  const { student, recentSuggestions } = studentData;
  const academics = student.academics || {};
  const semesters = academics.semesters || [];
  const currentSemester = semesters[semesters.length - 1] || {};

  return {
    userId: student.usn,
    name: student.name || 'Student',
    semester: currentSemester.semester || 1,
    branch: student.branch || 'Unknown',
    cgpa: currentSemester.cgpa || 0,
    sgpa: currentSemester.sgpa || 0,
    attendance: academics.attendance || 0,
    semesters: semesters.map(sem => ({
      semester: sem.semester,
      cgpa: sem.cgpa,
      sgpa: sem.sgpa,
      year: sem.year
    })),
    internalMarks: (academics.internalMarks || []).map(im => ({
      semester: im.semester,
      subject: im.subject,
      subjectCode: im.subjectCode,
      ia1: im.ia1 || 0,
      ia2: im.ia2 || 0,
      ia3: im.ia3 || 0,
      average: ((im.ia1 || 0) + (im.ia2 || 0) + (im.ia3 || 0)) / 3,
      semesterEndMarks: im.semesterEndMarks || 0
    })),
    certificates: (student.certificates || []).length,
    activityPoints: (student.aicteActivityPoints || []).map(ap => ({
      title: ap.title,
      category: ap.category,
      points: ap.points,
      date: ap.date
    })),
    ruleFlags,
    recentSuggestionsCount: recentSuggestions.length,
    lastSuggestionDate: recentSuggestions[0]?.generatedAt || null,
    metadata: {
      generatedAt: new Date().toISOString(),
      currentDate: new Date().toISOString()
    }
  };
}

/**
 * Get mentor ID for student
 */
async function getMentorIdForStudent(userId) {
  // This would typically query a mentorships collection
  // For now, returning a placeholder
  // TODO: Implement actual mentor lookup
  return 'MENTOR_' + userId.substring(0, 5);
}

/**
 * Process mentor agent job
 */
async function processMentorAgentJob(job) {
  const { userId, force, triggeredBy } = job.data;
  const jobId = job.id;

  console.log(`\n🚀 Processing mentor agent job ${jobId} for user ${userId}`);
  job.updateProgress(10);

  // Create AgentJob record
  const agentJob = await AgentJob.create({
    jobId,
    userId,
    type: 'mentorAgent',
    status: 'processing',
    triggeredBy,
    forced: force,
    startedAt: new Date()
  });

  try {
    // Step 1: Check rate limit (unless forced)
    if (!force) {
      const canEnqueue = await AgentJob.canEnqueueJob(userId, 'mentorAgent', 6);
      if (!canEnqueue) {
        throw new Error('Rate limit: Recent job exists for this user within 6 hours');
      }
    }
    job.updateProgress(20);

    // Step 2: Load student data
    const studentData = await loadStudentData(userId);
    job.updateProgress(30);

    // Step 3: Perform rule-based checks
    const ruleFlags = performRuleChecks(studentData.student);
    console.log(`🚩 Rule flags detected: ${ruleFlags.length}`);
    job.updateProgress(40);

    // Step 4: Normalize data for LLM
    const studentJson = normalizeStudentData(studentData, ruleFlags);
    job.updateProgress(50);

    // Step 5: Generate AI insights
    console.log(`🤖 Calling LLM for user ${userId}...`);
    const aiResult = await generateAIInsight(studentJson, 'mentor_plan', {
      maxRetries: 1,
      timeout: 60000
    });
    job.updateProgress(70);

    const { data: aiOutput, metadata } = aiResult;

    // Step 6: Add dates to plan
    const planWithDates = aiOutput.plan.map((dayPlan, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return {
        ...dayPlan,
        day: index + 1,
        date
      };
    });

    // Step 7: Save mentor suggestion
    const mentorSuggestion = await MentorSuggestion.create({
      userId,
      agent: 'mentorAgent',
      insights: aiOutput.insights,
      planLength: aiOutput.planLength,
      plan: planWithDates,
      microSupport: aiOutput.microSupport || [],
      resources: aiOutput.resources || [],
      suggestedMentorActions: aiOutput.mentorActions,
      confidence: aiOutput.confidence,
      generatedAt: new Date(),
      studentSnapshot: studentJson,
      promptHash: metadata.promptHash,
      modelUsed: metadata.modelUsed,
      tokenCostEstimate: metadata.tokenCostEstimate,
      outputHash: metadata.outputHash
    });

    console.log(`✅ Mentor suggestion created: ${mentorSuggestion._id}`);
    job.updateProgress(85);

    // Step 8: Mark job as completed
    await agentJob.markCompleted(mentorSuggestion._id);

    // Step 9: Send notifications
    // Notify student
    await Notification.createMentorSuggestionNotification(
      userId,
      mentorSuggestion._id,
      'student'
    );

    // Notify mentor
    const mentorId = await getMentorIdForStudent(userId);
    if (mentorId) {
      await Notification.createMentorSuggestionNotification(
        mentorId,
        mentorSuggestion._id,
        'mentor'
      );
    }

    job.updateProgress(100);
    console.log(`✅ Job ${jobId} completed successfully\n`);

    return {
      success: true,
      suggestionId: mentorSuggestion._id,
      insights: aiOutput.insights.length,
      planLength: aiOutput.planLength
    };

  } catch (error) {
    console.error(`❌ Job ${jobId} failed:`, error);
    
    // Mark job as failed
    await agentJob.markFailed(error);

    // Create alert notification for admin
    await Notification.create({
      userId: 'ADMIN',
      type: 'agent_alert',
      title: '🚨 Agent Job Failed',
      body: `Mentor agent job failed for user ${userId}: ${error.message}`,
      priority: 'high',
      payload: {
        jobId,
        userId,
        error: error.message
      }
    });

    throw error;
  }
}

/**
 * Create and start the worker
 */
function createMentorAgentWorker() {
  const worker = new Worker(
    'mentor-agent',
    processMentorAgentJob,
    {
      connection,
      concurrency: parseInt(process.env.WORKER_CONCURRENCY || '2'),
      limiter: {
        max: 10,
        duration: 60000 // Max 10 jobs per minute
      }
    }
  );

  worker.on('completed', (job, returnvalue) => {
    console.log(`✅ Job ${job.id} completed:`, returnvalue);
  });

  worker.on('failed', (job, error) => {
    console.error(`❌ Job ${job.id} failed:`, error.message);
  });

  worker.on('error', (error) => {
    console.error('❌ Worker error:', error);
  });

  console.log('👷 Mentor agent worker started');

  return worker;
}

module.exports = {
  createMentorAgentWorker,
  processMentorAgentJob,
  loadStudentData,
  performRuleChecks,
  normalizeStudentData
};
