const Notification = require('../models/Notification');
const Student = require('../models/Student');
const AcademicSemester = require('../models/AcademicSemester');
const InternalMarks = require('../models/InternalMarks');

class NotificationEngine {
    /**
     * Create a notification
     */
    async createNotification(userId, type, title, body, priority = 'medium', metadata = {}) {
        try {
            const notification = new Notification({
                userId,
                type,
                title,
                body,
                priority,
                payload: metadata,
                actionUrl: metadata.actionUrl || null,
                actionLabel: metadata.actionLabel || null
            });

            await notification.save();
            console.log(`✅ Notification created for ${userId}: ${title}`);
            return notification;
        } catch (error) {
            console.error(`❌ Error creating notification:`, error);
            throw error;
        }
    }

    /**
     * Check attendance and create alerts
     */
    async checkAttendance(student) {
        try {
            const attendance = student.attendance;
            if (!attendance || !attendance.percentage) return;

            const percentage = attendance.percentage;

            // Critical: Below 75%
            if (percentage < 75 && percentage >= 65) {
                await this.createNotification(
                    student.usn,
                    'attendance',
                    '⚠️ Attendance Alert',
                    `Your attendance is at ${percentage}%. You need at least 75% to appear for exams. Please improve your attendance immediately.`,
                    'high',
                    {
                        percentage,
                        threshold: 75,
                        actionUrl: '/attendance',
                        actionLabel: 'View Attendance'
                    }
                );
            }

            // Urgent: Below 65%
            if (percentage < 65) {
                await this.createNotification(
                    student.usn,
                    'attendance',
                    '🚨 Critical Attendance Alert',
                    `Your attendance has dropped to ${percentage}%! You are at risk of being barred from exams. Contact your mentor immediately.`,
                    'urgent',
                    {
                        percentage,
                        threshold: 75,
                        actionUrl: '/mentors',
                        actionLabel: 'Contact Mentor'
                    }
                );
            }

            // Trending downward check (if we have historical data)
            if (attendance.trend && attendance.trend === 'decreasing') {
                await this.createNotification(
                    student.usn,
                    'attendance',
                    '📉 Attendance Dropping',
                    'Your attendance has been consistently decreasing over the past 2 weeks. Please focus on attending classes regularly.',
                    'medium',
                    {
                        actionUrl: '/attendance',
                        actionLabel: 'View Details'
                    }
                );
            }
        } catch (error) {
            console.error('Error checking attendance:', error);
        }
    }

    /**
     * Check Internal Marks performance
     */
    async checkInternalMarks(student) {
        try {
            const currentSemester = student.academics?.currentSemester || 1;
            const internalMarks = await InternalMarks.findOne({
                usn: student.usn,
                semester: currentSemester
            });

            if (!internalMarks || !internalMarks.subjects) return;

            for (const subject of internalMarks.subjects) {
                // Check each IA
                ['ia1', 'ia2', 'ia3'].forEach(async (iaType) => {
                    const marks = subject[iaType];
                    if (marks && marks.obtained !== undefined && marks.obtained < 15) {
                        await this.createNotification(
                            student.usn,
                            'internal_marks',
                            `⚠️ Low ${iaType.toUpperCase()} Marks in ${subject.subjectName}`,
                            `You scored ${marks.obtained}/${marks.total} in ${iaType.toUpperCase()}. You are at risk in this subject. Please work harder or seek help.`,
                            'high',
                            {
                                subject: subject.subjectName,
                                assessment: iaType,
                                marks: marks.obtained,
                                total: marks.total,
                                actionUrl: `/internal-marks/semester/${currentSemester}`,
                                actionLabel: 'View Marks'
                            }
                        );
                    }
                });

                // Check for declining performance
                const ia1Marks = subject.ia1?.obtained || 0;
                const ia2Marks = subject.ia2?.obtained || 0;
                const ia3Marks = subject.ia3?.obtained || 0;

                if (ia2Marks < ia1Marks && ia3Marks < ia2Marks && ia3Marks > 0) {
                    await this.createNotification(
                        student.usn,
                        'internal_marks',
                        `📉 Declining Performance in ${subject.subjectName}`,
                        `Your marks are consistently decreasing in this subject. Consider studying harder or getting extra help.`,
                        'medium',
                        {
                            subject: subject.subjectName,
                            actionUrl: `/internal-marks/semester/${currentSemester}`,
                            actionLabel: 'View Trends'
                        }
                    );
                }
            }
        } catch (error) {
            console.error('Error checking internal marks:', error);
        }
    }

    /**
     * Check Semester Performance
     */
    async checkSemesterPerformance(student) {
        try {
            const academics = student.academics;
            if (!academics) return;

            // Check current SGPA
            const currentSemester = academics.currentSemester;
            const semesterData = academics.semesters?.find(s => s.semesterNumber === currentSemester);

            if (semesterData && semesterData.sgpa) {
                if (semesterData.sgpa < 6.0) {
                    await this.createNotification(
                        student.usn,
                        'semester_performance',
                        '⚠️ Low Semester Performance',
                        `Your SGPA for Semester ${currentSemester} is ${semesterData.sgpa}. This is below expectations. Please work on improving your grades.`,
                        'high',
                        {
                            sgpa: semesterData.sgpa,
                            semester: currentSemester,
                            actionUrl: `/semester-marks/${currentSemester}`,
                            actionLabel: 'View Results'
                        }
                    );
                }
            }

            // Check CGPA drop
            if (academics.overallCGPA && academics.previousCGPA) {
                if (academics.overallCGPA < academics.previousCGPA) {
                    const drop = (academics.previousCGPA - academics.overallCGPA).toFixed(2);
                    await this.createNotification(
                        student.usn,
                        'semester_performance',
                        '📉 CGPA Declined',
                        `Your CGPA has dropped by ${drop} points. Current CGPA: ${academics.overallCGPA}. Focus on improving in upcoming assessments.`,
                        'high',
                        {
                            currentCGPA: academics.overallCGPA,
                            previousCGPA: academics.previousCGPA,
                            drop,
                            actionUrl: '/academics',
                            actionLabel: 'View Academics'
                        }
                    );
                }
            }
        } catch (error) {
            console.error('Error checking semester performance:', error);
        }
    }

    /**
     * Check AICTE Activity Points
     */
    async checkAICTEPoints(student) {
        try {
            const aictePoints = student.aictePoints || { total: 0, target: 100 };
            const progressPercent = (aictePoints.total / aictePoints.target) * 100;

            // Check if below 50% by mid-year
            const currentMonth = new Date().getMonth();
            if (currentMonth >= 6 && progressPercent < 50) {
                await this.createNotification(
                    student.usn,
                    'aicte_points',
                    '⚠️ AICTE Points Alert',
                    `You have earned only ${aictePoints.total} out of ${aictePoints.target} AICTE points (${progressPercent.toFixed(0)}%). Participate in more activities to meet the requirement.`,
                    'medium',
                    {
                        currentPoints: aictePoints.total,
                        targetPoints: aictePoints.target,
                        progress: progressPercent,
                        actionUrl: '/activities',
                        actionLabel: 'View Activities'
                    }
                );
            }

            // Check for pending certificate verification
            if (aictePoints.pendingVerification && aictePoints.pendingVerification.length > 0) {
                await this.createNotification(
                    student.usn,
                    'aicte_points',
                    '📄 Certificate Verification Pending',
                    `You have ${aictePoints.pendingVerification.length} certificate(s) pending verification. Please submit them to your mentor.`,
                    'low',
                    {
                        count: aictePoints.pendingVerification.length,
                        actionUrl: '/activities',
                        actionLabel: 'Submit Certificates'
                    }
                );
            }
        } catch (error) {
            console.error('Error checking AICTE points:', error);
        }
    }

    /**
     * Check for Student Inactivity
     */
    async checkInactivity(student) {
        try {
            const lastLogin = student.lastLogin || student.updatedAt;
            const daysSinceLogin = Math.floor((new Date() - new Date(lastLogin)) / (1000 * 60 * 60 * 24));

            if (daysSinceLogin >= 3) {
                await this.createNotification(
                    student.usn,
                    'inactivity',
                    '👋 We Miss You!',
                    `You haven't logged in for ${daysSinceLogin} days. Check your dashboard for updates on assignments, attendance, and study plans.`,
                    'low',
                    {
                        daysSinceLogin,
                        actionUrl: '/dashboard',
                        actionLabel: 'Go to Dashboard'
                    }
                );
            }

            // Check study plan task completion
            if (student.studyPlan && student.studyPlan.incompleteTasks > 5) {
                await this.createNotification(
                    student.usn,
                    'task_reminder',
                    '📚 Pending Tasks',
                    `You have ${student.studyPlan.incompleteTasks} incomplete tasks in your study plan. Complete them to stay on track!`,
                    'medium',
                    {
                        incompleteTasks: student.studyPlan.incompleteTasks,
                        actionUrl: '/study-plan',
                        actionLabel: 'View Study Plan'
                    }
                );
            }
        } catch (error) {
            console.error('Error checking inactivity:', error);
        }
    }

    /**
     * Check for Career Development Progress
     */
    async checkCareerDevelopment(student) {
        try {
            const certificates = student.certificates || [];
            const lastCertificateDate = certificates.length > 0 
                ? new Date(certificates[certificates.length - 1].date)
                : null;

            if (lastCertificateDate) {
                const daysSinceLastCertificate = Math.floor((new Date() - lastCertificateDate) / (1000 * 60 * 60 * 24));

                if (daysSinceLastCertificate > 60) {
                    await this.createNotification(
                        student.usn,
                        'career_development',
                        '🎯 Time to Upskill',
                        `It's been ${Math.floor(daysSinceLastCertificate / 30)} months since your last certification. Consider taking a new course to enhance your skills.`,
                        'low',
                        {
                            daysSinceLastCertificate,
                            actionUrl: '/documents',
                            actionLabel: 'Add Certificate'
                        }
                    );
                }
            }

            // Check GitHub activity (if integrated)
            if (student.github && student.github.lastCommitDate) {
                const daysSinceCommit = Math.floor((new Date() - new Date(student.github.lastCommitDate)) / (1000 * 60 * 60 * 24));

                if (daysSinceCommit > 30) {
                    await this.createNotification(
                        student.usn,
                        'career_development',
                        '💻 Coding Activity Alert',
                        `No GitHub activity detected for ${daysSinceCommit} days. Keep building projects to strengthen your portfolio!`,
                        'low',
                        {
                            daysSinceCommit,
                            actionUrl: '/profile',
                            actionLabel: 'Update Profile'
                        }
                    );
                }
            }
        } catch (error) {
            console.error('Error checking career development:', error);
        }
    }

    /**
     * Check Wellbeing Signals from AI Chat
     */
    async checkWellbeing(student, recentChatMessages = []) {
        try {
            const stressKeywords = ['stressed', 'anxious', 'overwhelmed', 'depressed', 'sad', 'worried', 'can\'t handle'];
            
            let stressDetected = false;
            for (const message of recentChatMessages) {
                const messageText = message.text.toLowerCase();
                if (stressKeywords.some(keyword => messageText.includes(keyword))) {
                    stressDetected = true;
                    break;
                }
            }

            if (stressDetected) {
                await this.createNotification(
                    student.usn,
                    'wellbeing',
                    '💙 We Care About Your Wellbeing',
                    'We noticed you may be feeling stressed. Remember, your mental health matters. Take breaks, talk to your mentor, and focus on self-care. You\'ve got this!',
                    'medium',
                    {
                        actionUrl: '/mentors',
                        actionLabel: 'Talk to Mentor'
                    }
                );
            }
        } catch (error) {
            console.error('Error checking wellbeing:', error);
        }
    }

    /**
     * Create Exam/IA Reminders
     */
    async createExamReminder(studentUsn, examName, examDate, daysUntilExam) {
        try {
            let priority = 'medium';
            let title = '';
            let message = '';

            if (daysUntilExam === 7) {
                title = `📅 ${examName} in 1 Week`;
                message = `Your ${examName} is scheduled for ${examDate.toLocaleDateString()}. Start preparing now!`;
                priority = 'medium';
            } else if (daysUntilExam === 1) {
                title = `⏰ ${examName} Tomorrow`;
                message = `Your ${examName} is tomorrow (${examDate.toLocaleDateString()}). Make sure you're prepared!`;
                priority = 'high';
            } else if (daysUntilExam === 0) {
                title = `🎯 ${examName} Today`;
                message = `Your ${examName} is today! Good luck!`;
                priority = 'urgent';
            }

            await this.createNotification(
                studentUsn,
                'exam_reminder',
                title,
                message,
                priority,
                {
                    examName,
                    examDate: examDate.toISOString(),
                    daysUntilExam,
                    actionUrl: '/academics',
                    actionLabel: 'View Schedule'
                }
            );
        } catch (error) {
            console.error('Error creating exam reminder:', error);
        }
    }

    /**
     * Create Assignment/Deadline Reminder
     */
    async createDeadlineReminder(studentUsn, assignmentName, deadline, hoursUntilDeadline) {
        try {
            let priority = 'medium';
            let title = '';
            let message = '';

            if (hoursUntilDeadline <= 2) {
                title = `🚨 Urgent: ${assignmentName} Due Soon`;
                message = `${assignmentName} is due in ${hoursUntilDeadline} hour(s)! Submit now!`;
                priority = 'urgent';
            } else if (hoursUntilDeadline <= 48) {
                title = `⏰ ${assignmentName} Due in 48 Hours`;
                message = `Don't forget: ${assignmentName} is due on ${deadline.toLocaleString()}`;
                priority = 'high';
            }

            await this.createNotification(
                studentUsn,
                'deadline',
                title,
                message,
                priority,
                {
                    assignmentName,
                    deadline: deadline.toISOString(),
                    hoursUntilDeadline,
                    actionUrl: '/academics',
                    actionLabel: 'Submit Assignment'
                }
            );
        } catch (error) {
            console.error('Error creating deadline reminder:', error);
        }
    }

    /**
     * Create Mentor Alert for Student
     */
    async createMentorAlert(studentUsn, mentorName, reason) {
        try {
            await this.createNotification(
                studentUsn,
                'mentor_alert',
                `📢 Message from ${mentorName}`,
                `Your mentor wants to discuss: ${reason}. Please schedule a meeting at your earliest convenience.`,
                'high',
                {
                    mentorName,
                    reason,
                    actionUrl: '/meeting-notes',
                    actionLabel: 'Schedule Meeting'
                }
            );
        } catch (error) {
            console.error('Error creating mentor alert:', error);
        }
    }

    /**
     * Run all checks for a student
     */
    async runAllChecks(student) {
        console.log(`🔍 Running notification checks for ${student.usn}...`);

        await Promise.all([
            this.checkAttendance(student),
            this.checkInternalMarks(student),
            this.checkSemesterPerformance(student),
            this.checkAICTEPoints(student),
            this.checkInactivity(student),
            this.checkCareerDevelopment(student)
        ]);

        console.log(`✅ Completed checks for ${student.usn}`);
    }

    /**
     * Run checks for all students
     */
    async runChecksForAllStudents() {
        try {
            console.log('🚀 Starting notification engine for all students...');
            const students = await Student.find({ status: 'active' });

            console.log(`Found ${students.length} active students`);

            for (const student of students) {
                await this.runAllChecks(student);
            }

            console.log('✅ Notification engine completed for all students');
        } catch (error) {
            console.error('❌ Error in notification engine:', error);
        }
    }
}

module.exports = new NotificationEngine();
