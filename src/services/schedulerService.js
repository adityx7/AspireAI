const cron = require('node-cron');
const { enqueueMentorAgentJob } = require('../services/queueService');
const AgentJob = require('../models/AgentJob');
const MentorSuggestion = require('../models/MentorSuggestion');

let Student;
try {
  Student = require('../models/Student');
} catch (e) {
  console.warn('⚠️  Student model not found, scheduler may not work properly');
}

/**
 * Check if student is at risk based on academic metrics
 */
function isStudentAtRisk(student) {
  const academics = student.academics || {};
  
  // Low attendance
  if (academics.attendance < 75) return true;
  
  // CGPA drop
  const semesters = academics.semesters || [];
  if (semesters.length >= 2) {
    const latest = semesters[semesters.length - 1];
    const previous = semesters[semesters.length - 2];
    if (previous.cgpa - latest.cgpa > 0.3) return true;
  }
  
  // Low CGPA
  if (semesters.length > 0) {
    const currentCGPA = semesters[semesters.length - 1].cgpa;
    if (currentCGPA < 6.0) return true;
  }
  
  return false;
}

/**
 * Process at-risk students daily
 */
async function processAtRiskStudents() {
  if (!Student) {
    console.warn('⚠️  Student model not available, skipping at-risk check');
    return;
  }

  console.log('\n📊 Processing at-risk students...');
  
  try {
    const students = await Student.find({}).lean();
    let enqueuedCount = 0;
    
    for (const student of students) {
      if (isStudentAtRisk(student)) {
        const userId = student.usn;
        
        // Check if job was recently run
        const canEnqueue = await AgentJob.canEnqueueJob(userId, 'mentorAgent', 12);
        
        if (canEnqueue) {
          await enqueueMentorAgentJob(userId, {
            priority: 5,
            triggeredBy: 'scheduler',
            force: false
          });
          enqueuedCount++;
        }
      }
    }
    
    console.log(`✅ Enqueued ${enqueuedCount} jobs for at-risk students`);
  } catch (error) {
    console.error('❌ Error processing at-risk students:', error);
  }
}

/**
 * Process weekly jobs for all students
 */
async function processWeeklyJobs() {
  if (!Student) {
    console.warn('⚠️  Student model not available, skipping weekly jobs');
    return;
  }

  console.log('\n📅 Processing weekly jobs for all students...');
  
  try {
    const students = await Student.find({}).lean();
    let enqueuedCount = 0;
    
    for (const student of students) {
      const userId = student.usn;
      
      // Check if student had a job in last 7 days
      const recentJob = await AgentJob.findOne({
        userId,
        type: 'mentorAgent',
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });
      
      if (!recentJob) {
        await enqueueMentorAgentJob(userId, {
          priority: 1,
          triggeredBy: 'scheduler',
          force: false
        });
        enqueuedCount++;
      }
    }
    
    console.log(`✅ Enqueued ${enqueuedCount} weekly jobs`);
  } catch (error) {
    console.error('❌ Error processing weekly jobs:', error);
  }
}

/**
 * Cleanup old completed suggestions
 */
async function cleanupOldSuggestions() {
  console.log('\n🧹 Cleaning up old suggestions...');
  
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Delete old dismissed suggestions
    const dismissedResult = await MentorSuggestion.deleteMany({
      dismissed: true,
      generatedAt: { $lt: thirtyDaysAgo }
    });
    
    // Delete old unreviewed suggestions
    const unreviewedResult = await MentorSuggestion.deleteMany({
      reviewed: false,
      generatedAt: { $lt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }
    });
    
    console.log(`✅ Deleted ${dismissedResult.deletedCount} dismissed and ${unreviewedResult.deletedCount} unreviewed suggestions`);
  } catch (error) {
    console.error('❌ Error cleaning up suggestions:', error);
  }
}

/**
 * Send reminder notifications for active plans
 */
async function sendPlanReminders() {
  console.log('\n⏰ Sending plan reminders...');
  
  try {
    const Notification = require('../models/Notification');
    
    // Find active plans for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const activePlans = await MentorSuggestion.find({
      applied: true,
      dismissed: false,
      'plan.date': {
        $gte: today,
        $lt: tomorrow
      }
    }).lean();
    
    let reminderCount = 0;
    
    for (const plan of activePlans) {
      const todaysPlan = plan.plan.find(p => {
        const planDate = new Date(p.date);
        planDate.setHours(0, 0, 0, 0);
        return planDate.getTime() === today.getTime();
      });
      
      if (todaysPlan && todaysPlan.tasks.length > 0) {
        // Send morning reminder
        await Notification.create({
          userId: plan.userId,
          type: 'plan_reminder',
          title: '📚 Daily Study Plan',
          body: `You have ${todaysPlan.tasks.length} tasks scheduled for today. Stay on track!`,
          priority: 'medium',
          payload: {
            suggestionId: plan._id,
            day: todaysPlan.day,
            tasksCount: todaysPlan.tasks.length
          },
          actionUrl: `/dashboard/study-plan`,
          actionLabel: 'View Tasks'
        });
        reminderCount++;
      }
    }
    
    console.log(`✅ Sent ${reminderCount} plan reminders`);
  } catch (error) {
    console.error('❌ Error sending plan reminders:', error);
  }
}

/**
 * Initialize all scheduled jobs
 */
function initializeScheduler() {
  console.log('⏰ Initializing scheduler...');
  
  // Daily at 1 AM: Process at-risk students
  cron.schedule('0 1 * * *', processAtRiskStudents, {
    timezone: process.env.TIMEZONE || 'Asia/Kolkata'
  });
  console.log('✅ Scheduled: Daily at-risk check at 1:00 AM');
  
  // Weekly on Monday at 2 AM: Process all students
  cron.schedule('0 2 * * 1', processWeeklyJobs, {
    timezone: process.env.TIMEZONE || 'Asia/Kolkata'
  });
  console.log('✅ Scheduled: Weekly jobs on Monday at 2:00 AM');
  
  // Daily at 8 AM: Send plan reminders
  cron.schedule('0 8 * * *', sendPlanReminders, {
    timezone: process.env.TIMEZONE || 'Asia/Kolkata'
  });
  console.log('✅ Scheduled: Daily plan reminders at 8:00 AM');
  
  // Weekly on Sunday at 3 AM: Cleanup old data
  cron.schedule('0 3 * * 0', cleanupOldSuggestions, {
    timezone: process.env.TIMEZONE || 'Asia/Kolkata'
  });
  console.log('✅ Scheduled: Weekly cleanup on Sunday at 3:00 AM');
  
  console.log('✅ Scheduler initialized successfully\n');
}

/**
 * Run immediate test of at-risk processing (for development)
 */
async function runImmediateTest() {
  console.log('🧪 Running immediate test...');
  await processAtRiskStudents();
}

module.exports = {
  initializeScheduler,
  processAtRiskStudents,
  processWeeklyJobs,
  cleanupOldSuggestions,
  sendPlanReminders,
  runImmediateTest,
  isStudentAtRisk
};
