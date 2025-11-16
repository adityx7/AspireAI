const { Queue, Worker } = require('bullmq');
const mongoose = require('mongoose');
const MentorSuggestion = require('../models/MentorSuggestion');
const StudyPlan = require('../models/StudyPlan');
const Notification = require('../models/Notification');
const academicRiskService = require('../services/academicRiskService');
const aiService = require('../services/aiService');

// Redis configuration
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

const redisConnection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null
};

// Create queue
const mentorAgentQueue = new Queue('mentorAgentQueue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: {
      count: 100,
      age: 24 * 3600 // Keep completed jobs for 24 hours
    },
    removeOnFail: {
      age: 7 * 24 * 3600 // Keep failed jobs for 7 days
    }
  }
});

/**
 * Process mentor agent job
 * @param {Object} job - BullMQ job
 * @returns {Promise<Object>} - Processing result
 */
async function processMentorAgentJob(job) {
  const { userId, triggerType, manual } = job.data;
  
  console.log('======================================');
  console.log(`🤖 AGENT WORKER STARTED`);
  console.log(`User ID: ${userId}`);
  console.log(`Trigger: ${triggerType}`);
  console.log(`Manual: ${manual || false}`);
  console.log('======================================');

  try {
    // Update job progress
    await job.updateProgress(10);

    // Step 1: Load student data
    console.log('📥 Loading student data...');
    const User = mongoose.model('User');
    const student = await User.findById(userId)
      .populate('attendance')
      .populate('internalMarks')
      .populate('semesterMarks');

    if (!student) {
      throw new Error(`Student not found: ${userId}`);
    }

    console.log(`✅ Loaded data for ${student.name} (${student.usn})`);
    await job.updateProgress(20);

    // Step 2: Generate risk profile
    console.log('🔍 Analyzing academic risks...');
    const riskProfile = await academicRiskService.generateRiskProfile(student);
    
    console.log(`📊 Risk Level: ${riskProfile.overallRisk.toUpperCase()}`);
    console.log(`   - Low Attendance: ${riskProfile.lowAttendance.length} subjects`);
    console.log(`   - Weak Subjects: ${riskProfile.weakSubjects.length} subjects`);
    console.log(`   - CGPA Drop: ${riskProfile.cgpaDrop ? 'YES' : 'NO'}`);

    await job.updateProgress(40);

    // Step 3: Generate student snapshot for AI
    const studentSnapshot = academicRiskService.generateStudentSnapshot(student, riskProfile);

    // Step 4: Call AI to generate study plan
    console.log('🧠 Generating AI study plan...');
    const aiPlan = await aiService.generateStudyPlan(studentSnapshot, {
      maxRetries: 3,
      temperature: 0.7
    });

    console.log(`✅ AI plan generated: ${aiPlan.planLength} days, ${aiPlan.plan.length} days of tasks`);
    await job.updateProgress(70);

    // Step 5: Deactivate old plans
    console.log('🗑️  Deactivating old plans...');
    await MentorSuggestion.deactivateOldPlans(userId);

    // Step 6: Save new plan to database
    console.log('💾 Saving study plan to database...');
    const mentorSuggestion = new MentorSuggestion({
      userId: userId,
      insights: aiPlan.insights,
      planLength: aiPlan.planLength,
      plan: aiPlan.plan,
      resources: aiPlan.resources,
      mentorActions: aiPlan.mentorActions,
      riskProfile: aiPlan.riskProfile,
      generatedBy: manual ? 'manual' : triggerType || 'auto',
      active: true,
      reviewed: false,
      accepted: false
    });

    await mentorSuggestion.save();
    console.log(`✅ Saved suggestion ID: ${mentorSuggestion._id}`);

    await job.updateProgress(80);

    // Step 7: Update or create StudyPlan document
    console.log('� Updating study plan tracker...');
    const studyPlan = await StudyPlan.getOrCreate(userId);
    
    studyPlan.activePlanId = mentorSuggestion._id;
    studyPlan.statistics.totalPlansGenerated += 1;
    await studyPlan.updateProgress(mentorSuggestion);

    console.log('✅ Study plan tracker updated');

    await job.updateProgress(90);

    // Step 8: Create notifications
    console.log('🔔 Creating notifications...');
    
    // Notify student
    await Notification.create({
      userId: userId,
      type: 'study_plan_generated',
      title: '📚 Your Personalized Study Plan is Ready!',
      message: `A ${aiPlan.planLength}-day study plan has been generated based on your academic performance. Check it out now!`,
      actionUrl: '/student/study-plan',
      priority: riskProfile.overallRisk === 'high' ? 'high' : 'medium',
      read: false
    });

    // Notify mentor if risk is medium or high
    if (riskProfile.overallRisk === 'high' || riskProfile.overallRisk === 'medium') {
      const mentorId = student.mentorId;
      
      if (mentorId) {
        await Notification.create({
          userId: mentorId,
          type: 'student_at_risk',
          title: `⚠️ Student Requires Attention: ${student.name}`,
          message: `${student.name} (${student.usn}) has been flagged with ${riskProfile.overallRisk} risk. Review their study plan and consider intervention.`,
          actionUrl: `/mentor/review-plan/${mentorSuggestion._id}`,
          priority: 'high',
          metadata: {
            studentId: userId,
            suggestionId: mentorSuggestion._id,
            riskLevel: riskProfile.overallRisk
          },
          read: false
        });
        
        console.log(`🔔 Mentor notified about ${riskProfile.overallRisk} risk student`);
      }
    }

    console.log('✅ Notifications created');

    await job.updateProgress(100);

    // Final summary
    console.log('======================================');
    console.log('✅ AGENT PROCESSING COMPLETED');
    console.log(`Plan ID: ${mentorSuggestion._id}`);
    console.log(`Risk Level: ${riskProfile.overallRisk}`);
    console.log(`Plan Length: ${aiPlan.planLength} days`);
    console.log(`Total Tasks: ${aiPlan.plan.reduce((sum, day) => sum + day.tasks.length, 0)}`);
    console.log('======================================');

    return {
      success: true,
      userId: userId,
      suggestionId: mentorSuggestion._id,
      riskLevel: riskProfile.overallRisk,
      planLength: aiPlan.planLength,
      tasksCount: aiPlan.plan.reduce((sum, day) => sum + day.tasks.length, 0)
    };

  } catch (error) {
    console.error('======================================');
    console.error('❌ AGENT PROCESSING FAILED');
    console.error(`User ID: ${userId}`);
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error('======================================');

    // Create error notification for student
    try {
      await Notification.create({
        userId: userId,
        type: 'system_error',
        title: '⚠️ Study Plan Generation Failed',
        message: 'We encountered an error while generating your study plan. Our team has been notified. Please try again later.',
        priority: 'medium',
        read: false
      });
    } catch (notifError) {
      console.error('Failed to create error notification:', notifError);
    }

    throw error;
  }
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

// Create worker
const worker = new Worker(
  'mentorAgentQueue',
  processMentorAgentJob,
  {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 students concurrently
    limiter: {
      max: 10, // Max 10 jobs
      duration: 60000 // Per minute
    }
  }
);

// Worker event listeners
worker.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed successfully`);
  console.log(`   Result:`, result);
});

worker.on('failed', (job, error) => {
  console.error(`❌ Job ${job.id} failed:`, error.message);
  console.error(`   Attempts: ${job.attemptsMade}/${job.opts.attempts}`);
});

worker.on('error', (error) => {
  console.error('❌ Worker error:', error);
});

worker.on('stalled', (jobId) => {
  console.warn(`⚠️ Job ${jobId} stalled`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, closing worker...');
  await worker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, closing worker...');
  await worker.close();
  process.exit(0);
});

console.log('======================================');
console.log('🚀 MENTOR AGENT WORKER STARTED');
console.log(`Redis: ${REDIS_HOST}:${REDIS_PORT}`);
console.log(`Queue: mentorAgentQueue`);
console.log(`Concurrency: 5`);
console.log('======================================');

module.exports = {
  worker,
  mentorAgentQueue,
  processMentorAgentJob
};
