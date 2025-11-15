/**
 * Agentic AI Worker Server
 * Starts BullMQ workers and scheduler for autonomous mentor suggestions
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { createMentorAgentWorker } = require('./workers/mentorAgentWorker');
const { initializeScheduler } = require('./services/schedulerService');
const { cleanupJobs } = require('./services/queueService');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorship_platform';

async function startWorkerServer() {
  console.log('🚀 Starting Agentic AI Worker Server...\n');

  try {
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected\n');

    // Start BullMQ worker
    console.log('👷 Starting BullMQ workers...');
    const worker = createMentorAgentWorker();
    console.log('');

    // Initialize scheduler
    initializeScheduler();

    // Cleanup old jobs on startup
    console.log('🧹 Running initial cleanup...');
    await cleanupJobs();
    console.log('');

    console.log('✅ Agentic AI Worker Server is running!\n');
    console.log('Configuration:');
    console.log(`- MongoDB: ${MONGODB_URI}`);
    console.log(`- Redis: ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`);
    console.log(`- LLM Provider: ${process.env.LLM_PROVIDER || 'openai'}`);
    console.log(`- Worker Concurrency: ${process.env.WORKER_CONCURRENCY || 2}`);
    console.log(`- Timezone: ${process.env.TIMEZONE || 'Asia/Kolkata'}\n`);

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
      await worker.close();
      await mongoose.connection.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('\n⚠️  SIGINT received, shutting down gracefully...');
      await worker.close();
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start worker server:', error);
    process.exit(1);
  }
}

// Start if running directly
if (require.main === module) {
  startWorkerServer();
}

module.exports = { startWorkerServer };
