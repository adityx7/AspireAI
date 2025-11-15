const { Queue } = require('bullmq');
const Redis = require('ioredis');

// Redis connection
const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

connection.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

connection.on('connect', () => {
  console.log('✅ Redis connected');
});

// Create queues
const mentorAgentQueue = new Queue('mentor-agent', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: {
      age: 86400, // Keep completed jobs for 24 hours
      count: 1000
    },
    removeOnFail: {
      age: 604800 // Keep failed jobs for 7 days
    }
  }
});

const careerPlannerQueue = new Queue('career-planner', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: {
      age: 86400,
      count: 1000
    },
    removeOnFail: {
      age: 604800
    }
  }
});

/**
 * Enqueue a mentor agent job
 * @param {String} userId - Student USN/ID
 * @param {Object} options - Job options
 * @returns {Promise<Job>}
 */
async function enqueueMentorAgentJob(userId, options = {}) {
  const {
    priority = 0,
    force = false,
    triggeredBy = 'manual'
  } = options;

  const jobId = `mentor-${userId}-${Date.now()}`;
  
  const job = await mentorAgentQueue.add(
    'generate-mentor-plan',
    {
      userId,
      force,
      triggeredBy,
      enqueuedAt: new Date().toISOString()
    },
    {
      jobId,
      priority,
      attempts: force ? 3 : 2
    }
  );

  console.log(`📬 Enqueued mentor agent job ${jobId} for user ${userId}`);
  return job;
}

/**
 * Enqueue a career planner job
 * @param {String} userId - Student USN/ID
 * @param {Object} options - Job options
 * @returns {Promise<Job>}
 */
async function enqueueCareerPlannerJob(userId, options = {}) {
  const {
    priority = 0,
    force = false,
    triggeredBy = 'manual'
  } = options;

  const jobId = `career-${userId}-${Date.now()}`;
  
  const job = await careerPlannerQueue.add(
    'generate-career-plan',
    {
      userId,
      force,
      triggeredBy,
      enqueuedAt: new Date().toISOString()
    },
    {
      jobId,
      priority
    }
  );

  console.log(`📬 Enqueued career planner job ${jobId} for user ${userId}`);
  return job;
}

/**
 * Get job status
 * @param {String} jobId
 * @returns {Promise<Object>}
 */
async function getJobStatus(jobId) {
  let job;
  
  // Check in mentor agent queue
  job = await mentorAgentQueue.getJob(jobId);
  if (job) {
    const state = await job.getState();
    return {
      jobId,
      state,
      progress: job.progress,
      data: job.data,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn
    };
  }

  // Check in career planner queue
  job = await careerPlannerQueue.getJob(jobId);
  if (job) {
    const state = await job.getState();
    return {
      jobId,
      state,
      progress: job.progress,
      data: job.data,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn
    };
  }

  return null;
}

/**
 * Get queue statistics
 */
async function getQueueStats() {
  const mentorStats = await mentorAgentQueue.getJobCounts(
    'waiting',
    'active',
    'completed',
    'failed'
  );

  const careerStats = await careerPlannerQueue.getJobCounts(
    'waiting',
    'active',
    'completed',
    'failed'
  );

  return {
    mentorAgent: mentorStats,
    careerPlanner: careerStats
  };
}

/**
 * Cleanup old jobs
 */
async function cleanupJobs() {
  await mentorAgentQueue.clean(86400000, 1000, 'completed'); // 24 hours
  await mentorAgentQueue.clean(604800000, 1000, 'failed'); // 7 days
  await careerPlannerQueue.clean(86400000, 1000, 'completed');
  await careerPlannerQueue.clean(604800000, 1000, 'failed');
  
  console.log('🧹 Old jobs cleaned up');
}

module.exports = {
  mentorAgentQueue,
  careerPlannerQueue,
  connection,
  enqueueMentorAgentJob,
  enqueueCareerPlannerJob,
  getJobStatus,
  getQueueStats,
  cleanupJobs
};
