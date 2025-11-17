const cron = require('node-cron');
const notificationEngine = require('./notificationEngine');

class NotificationScheduler {
    constructor() {
        this.jobs = [];
    }

    /**
     * Start daily notification checks at 8:00 AM
     */
    startDailyChecks() {
        // Run daily at 8:00 AM
        const dailyJob = cron.schedule('0 8 * * *', async () => {
            console.log('🔔 Running daily notification checks...');
            try {
                await notificationEngine.runChecksForAllStudents();
                console.log('✅ Daily notification checks completed');
            } catch (error) {
                console.error('❌ Error in daily notification checks:', error);
            }
        }, {
            scheduled: true,
            timezone: 'Asia/Kolkata'
        });

        this.jobs.push({ name: 'daily-checks', job: dailyJob });
        console.log('✅ Daily notification scheduler started (8:00 AM IST)');
    }

    /**
     * Start hourly priority checks (for urgent items)
     */
    startHourlyChecks() {
        // Run every hour
        const hourlyJob = cron.schedule('0 * * * *', async () => {
            console.log('⏰ Running hourly notification checks...');
            try {
                // Check for deadlines, exam reminders, etc.
                await notificationEngine.runChecksForAllStudents();
                console.log('✅ Hourly notification checks completed');
            } catch (error) {
                console.error('❌ Error in hourly notification checks:', error);
            }
        }, {
            scheduled: true,
            timezone: 'Asia/Kolkata'
        });

        this.jobs.push({ name: 'hourly-checks', job: hourlyJob });
        console.log('✅ Hourly notification scheduler started');
    }

    /**
     * Start exam reminder checks (runs daily at 6:00 PM)
     */
    startExamReminderChecks() {
        const examReminderJob = cron.schedule('0 18 * * *', async () => {
            console.log('📚 Running exam reminder checks...');
            try {
                // TODO: Implement exam reminder logic
                const Student = require('../models/Student');
                const students = await Student.find({ status: 'active' });

                for (const student of students) {
                    // Check for upcoming exams in the next 7 days and 1 day
                    if (student.upcomingExams) {
                        for (const exam of student.upcomingExams) {
                            const examDate = new Date(exam.date);
                            const today = new Date();
                            const daysUntilExam = Math.floor((examDate - today) / (1000 * 60 * 60 * 24));

                            if (daysUntilExam === 7 || daysUntilExam === 1 || daysUntilExam === 0) {
                                await notificationEngine.createExamReminder(
                                    student.usn,
                                    exam.name,
                                    examDate,
                                    daysUntilExam
                                );
                            }
                        }
                    }
                }

                console.log('✅ Exam reminder checks completed');
            } catch (error) {
                console.error('❌ Error in exam reminder checks:', error);
            }
        }, {
            scheduled: true,
            timezone: 'Asia/Kolkata'
        });

        this.jobs.push({ name: 'exam-reminders', job: examReminderJob });
        console.log('✅ Exam reminder scheduler started (6:00 PM IST)');
    }

    /**
     * Start deadline reminder checks (runs every 6 hours)
     */
    startDeadlineReminderChecks() {
        const deadlineJob = cron.schedule('0 */6 * * *', async () => {
            console.log('📅 Running deadline reminder checks...');
            try {
                // TODO: Implement deadline reminder logic
                const Student = require('../models/Student');
                const students = await Student.find({ status: 'active' });

                for (const student of students) {
                    if (student.assignments) {
                        for (const assignment of student.assignments) {
                            const deadline = new Date(assignment.deadline);
                            const now = new Date();
                            const hoursUntilDeadline = Math.floor((deadline - now) / (1000 * 60 * 60));

                            if (hoursUntilDeadline <= 48 && hoursUntilDeadline > 0) {
                                await notificationEngine.createDeadlineReminder(
                                    student.usn,
                                    assignment.name,
                                    deadline,
                                    hoursUntilDeadline
                                );
                            }
                        }
                    }
                }

                console.log('✅ Deadline reminder checks completed');
            } catch (error) {
                console.error('❌ Error in deadline reminder checks:', error);
            }
        }, {
            scheduled: true,
            timezone: 'Asia/Kolkata'
        });

        this.jobs.push({ name: 'deadline-reminders', job: deadlineJob });
        console.log('✅ Deadline reminder scheduler started (every 6 hours)');
    }

    /**
     * Start all schedulers
     */
    startAll() {
        console.log('🚀 Starting all notification schedulers...');
        this.startDailyChecks();
        this.startHourlyChecks();
        this.startExamReminderChecks();
        this.startDeadlineReminderChecks();
        console.log('✅ All notification schedulers started successfully');
    }

    /**
     * Stop all schedulers
     */
    stopAll() {
        console.log('🛑 Stopping all notification schedulers...');
        this.jobs.forEach(({ name, job }) => {
            job.stop();
            console.log(`   Stopped: ${name}`);
        });
        this.jobs = [];
        console.log('✅ All notification schedulers stopped');
    }

    /**
     * Get status of all schedulers
     */
    getStatus() {
        return this.jobs.map(({ name, job }) => ({
            name,
            running: job.running || false
        }));
    }
}

module.exports = new NotificationScheduler();
