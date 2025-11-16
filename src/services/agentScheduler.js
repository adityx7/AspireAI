const cron = require('node-cron');
const mongoose = require('mongoose');
const { mentorAgentQueue } = require('../workers/mentorAgentWorker');

/**
 * Agent Scheduler
 * Manages automated triggers for agent workers
 */

class AgentScheduler {
  constructor() {
    this.jobs = [];
    this.isRunning = false;
  }

  /**
   * Start all scheduled jobs
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️  Scheduler already running');
      return;
    }

    console.log('======================================');
    console.log('📅 AGENT SCHEDULER STARTING');
    console.log('======================================');

    // Daily scan at 3:00 AM
    this.scheduleDailyScan();

    // Cleanup old data at 2:00 AM
    this.scheduleCleanup();

    this.isRunning = true;
    console.log('✅ Scheduler started successfully');
  }

  /**
   * Stop all scheduled jobs
   */
  stop() {
    console.log('🛑 Stopping scheduler...');
    this.jobs.forEach(job => job.stop());
    this.jobs = [];
    this.isRunning = false;
    console.log('✅ Scheduler stopped');
  }

  /**
   * Schedule daily scan of all students at 3:00 AM
   */
  scheduleDailyScan() {
    const job = cron.schedule('0 3 * * *', async () => {
      console.log('======================================');
      console.log('🌅 DAILY SCAN STARTED');
      console.log(`Time: ${new Date().toISOString()}`);
      console.log('======================================');

      try {
        await this.runDailyScan();
      } catch (error) {
        console.error('❌ Daily scan failed:', error);
      }
    });

    this.jobs.push(job);
    console.log('📅 Daily scan scheduled: 3:00 AM every day');
  }

  /**
   * Schedule cleanup at 2:00 AM
   */
  scheduleCleanup() {
    const job = cron.schedule('0 2 * * *', async () => {
      console.log('🧹 Running cleanup...');

      try {
        await this.cleanupOldData();
      } catch (error) {
        console.error('❌ Cleanup failed:', error);
      }
    });

    this.jobs.push(job);
    console.log('📅 Cleanup scheduled: 2:00 AM every day');
  }

  /**
   * Run daily scan for all active students
   */
  async runDailyScan() {
    try {
      const User = mongoose.model('User');

      // Find all active students
      const students = await User.find({
        role: 'student',
        active: true
      }).select('_id usn name');

      console.log(`📊 Found ${students.length} active students`);

      let queued = 0;
      let skipped = 0;

      // Queue jobs for each student
      for (const student of students) {
        try {
          // Check if student needs scanning
          const shouldScan = await this.shouldScanStudent(student._id);

          if (shouldScan) {
            await mentorAgentQueue.add('daily-scan', {
              userId: student._id,
              triggerType: 'daily-scan',
              manual: false
            });

            queued++;
            console.log(`✅ Queued: ${student.usn}`);
          } else {
            skipped++;
          }
        } catch (error) {
          console.error(`❌ Failed to queue ${student.usn}:`, error.message);
        }
      }

      console.log('======================================');
      console.log('📊 DAILY SCAN SUMMARY');
      console.log(`Total students: ${students.length}`);
      console.log(`Queued: ${queued}`);
      console.log(`Skipped: ${skipped}`);
      console.log('======================================');

    } catch (error) {
      console.error('❌ Daily scan error:', error);
      throw error;
    }
  }

  /**
   * Determine if student should be scanned
   * @param {String} userId - Student ID
   * @returns {Boolean}
   */
  async shouldScanStudent(userId) {
    try {
      const MentorSuggestion = mongoose.model('MentorSuggestion');

      // Check last suggestion date
      const lastSuggestion = await MentorSuggestion.findOne({
        userId,
        active: true
      }).sort({ createdAt: -1 });

      // Scan if no active plan or plan is older than 7 days
      if (!lastSuggestion) {
        return true;
      }

      const daysSinceLastPlan = Math.floor(
        (Date.now() - lastSuggestion.createdAt) / (1000 * 60 * 60 * 24)
      );

      return daysSinceLastPlan >= 7;

    } catch (error) {
      console.error('Error checking student scan status:', error);
      return false;
    }
  }

  /**
   * Trigger scan on attendance update
   * @param {String} userId - Student ID
   */
  async triggerOnAttendanceUpdate(userId) {
    console.log(`📊 Attendance updated for user ${userId}`);

    try {
      await mentorAgentQueue.add('attendance-trigger', {
        userId,
        triggerType: 'attendance-update',
        manual: false
      }, {
        priority: 2
      });

      console.log(`✅ Queued agent job for attendance update: ${userId}`);
    } catch (error) {
      console.error(`❌ Failed to queue attendance trigger:`, error);
    }
  }

  /**
   * Trigger scan on IA marks update
   * @param {String} userId - Student ID
   */
  async triggerOnIAMarksUpdate(userId) {
    console.log(`📝 IA marks updated for user ${userId}`);

    try {
      await mentorAgentQueue.add('ia-marks-trigger', {
        userId,
        triggerType: 'ia-marks-update',
        manual: false
      }, {
        priority: 2
      });

      console.log(`✅ Queued agent job for IA marks update: ${userId}`);
    } catch (error) {
      console.error(`❌ Failed to queue IA marks trigger:`, error);
    }
  }

  /**
   * Manual trigger by mentor
   * @param {String} userId - Student ID
   * @param {String} mentorId - Mentor ID who triggered
   */
  async triggerManual(userId, mentorId) {
    console.log(`👨‍🏫 Manual trigger by mentor ${mentorId} for student ${userId}`);

    try {
      await mentorAgentQueue.add('manual-trigger', {
        userId,
        triggerType: 'manual',
        manual: true,
        requestedBy: mentorId
      }, {
        priority: 1 // Higher priority
      });

      console.log(`✅ Queued manual agent job: ${userId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to queue manual trigger:`, error);
      return false;
    }
  }

  /**
   * Student request for new plan
   * @param {String} userId - Student ID
   */
  async triggerStudentRequest(userId) {
    console.log(`🎓 Student ${userId} requested new plan`);

    try {
      // Check rate limit - only allow once per day
      const MentorSuggestion = mongoose.model('MentorSuggestion');
      const recentRequest = await MentorSuggestion.findOne({
        userId,
        generatedBy: 'student-request',
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      if (recentRequest) {
        console.log(`⚠️  Rate limit: Student ${userId} already requested plan today`);
        return {
          success: false,
          message: 'You can only request a new plan once per day'
        };
      }

      await mentorAgentQueue.add('student-request', {
        userId,
        triggerType: 'student-request',
        manual: true
      }, {
        priority: 2
      });

      console.log(`✅ Queued student-requested agent job: ${userId}`);
      return {
        success: true,
        message: 'Your study plan is being generated. You will be notified when ready.'
      };
    } catch (error) {
      console.error(`❌ Failed to queue student request:`, error);
      return {
        success: false,
        message: 'Failed to generate plan. Please try again later.'
      };
    }
  }

  /**
   * Cleanup old data
   */
  async cleanupOldData() {
    console.log('🧹 Cleaning up old data...');

    try {
      const MentorSuggestion = mongoose.model('MentorSuggestion');
      const StudyPlan = mongoose.model('StudyPlan');

      // Deactivate suggestions older than 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const result = await MentorSuggestion.updateMany(
        {
          active: true,
          createdAt: { $lt: thirtyDaysAgo }
        },
        {
          $set: { active: false }
        }
      );

      console.log(`✅ Deactivated ${result.modifiedCount} old suggestions`);

      // Remove very old unaccepted suggestions (90+ days)
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      
      const deleteResult = await MentorSuggestion.deleteMany({
        accepted: false,
        createdAt: { $lt: ninetyDaysAgo }
      });

      console.log(`✅ Deleted ${deleteResult.deletedCount} very old unaccepted suggestions`);

    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobs: this.jobs.length,
      jobs: this.jobs.map((job, index) => ({
        index,
        running: job.options ? true : false
      }))
    };
  }
}

// Create singleton instance
const scheduler = new AgentScheduler();

module.exports = scheduler;
