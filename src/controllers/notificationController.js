const Notification = require('../models/Notification');
const notificationEngine = require('../services/notificationEngine');

class NotificationController {
    /**
     * Get all notifications for a student
     * GET /api/notifications/:userId
     */
    async getNotifications(req, res) {
        try {
            const { userId } = req.params;
            const { read, type, limit = 50, page = 1 } = req.query;

            const query = { userId };
            
            if (read !== undefined) {
                query.read = read === 'true';
            }
            
            if (type) {
                query.type = type;
            }

            const skip = (page - 1) * limit;

            const notifications = await Notification
                .find(query)
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .skip(skip);

            const total = await Notification.countDocuments(query);
            const unreadCount = await Notification.getUnreadCount(userId);

            res.json({
                success: true,
                notifications,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                },
                unreadCount
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch notifications',
                error: error.message
            });
        }
    }

    /**
     * Get unread count
     * GET /api/notifications/:userId/unread-count
     */
    async getUnreadCount(req, res) {
        try {
            const { userId } = req.params;
            const count = await Notification.getUnreadCount(userId);

            res.json({
                success: true,
                count
            });
        } catch (error) {
            console.error('Error fetching unread count:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch unread count',
                error: error.message
            });
        }
    }

    /**
     * Create a notification
     * POST /api/notifications
     */
    async createNotification(req, res) {
        try {
            const { userId, type, title, body, priority, payload } = req.body;

            if (!userId || !type || !title || !body) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const notification = await notificationEngine.createNotification(
                userId,
                type,
                title,
                body,
                priority,
                payload
            );

            res.status(201).json({
                success: true,
                notification
            });
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create notification',
                error: error.message
            });
        }
    }

    /**
     * Mark notification as read
     * PUT /api/notifications/:id/read
     */
    async markAsRead(req, res) {
        try {
            const { id } = req.params;

            const notification = await Notification.findByIdAndUpdate(
                id,
                { 
                    read: true,
                    readAt: new Date()
                },
                { new: true }
            );

            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found'
                });
            }

            res.json({
                success: true,
                notification
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to mark notification as read',
                error: error.message
            });
        }
    }

    /**
     * Mark all notifications as read
     * PUT /api/notifications/:userId/mark-all-read
     */
    async markAllAsRead(req, res) {
        try {
            const { userId } = req.params;

            const result = await Notification.markAllRead(userId);

            res.json({
                success: true,
                message: `Marked ${result.modifiedCount} notification(s) as read`
            });
        } catch (error) {
            console.error('Error marking all as read:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to mark all notifications as read',
                error: error.message
            });
        }
    }

    /**
     * Delete a notification
     * DELETE /api/notifications/:id
     */
    async deleteNotification(req, res) {
        try {
            const { id } = req.params;

            const notification = await Notification.findByIdAndDelete(id);

            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found'
                });
            }

            res.json({
                success: true,
                message: 'Notification deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete notification',
                error: error.message
            });
        }
    }

    /**
     * Run notification checks for a specific student
     * POST /api/notifications/check/:userId
     */
    async runChecksForStudent(req, res) {
        try {
            const { userId } = req.params;
            const Student = require('../models/Student');

            const student = await Student.findOne({ usn: userId });

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            await notificationEngine.runAllChecks(student);

            res.json({
                success: true,
                message: 'Notification checks completed'
            });
        } catch (error) {
            console.error('Error running checks:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to run notification checks',
                error: error.message
            });
        }
    }

    /**
     * Run notification checks for all students
     * POST /api/notifications/check-all
     */
    async runChecksForAllStudents(req, res) {
        try {
            // Run in background
            notificationEngine.runChecksForAllStudents().catch(err => {
                console.error('Background check failed:', err);
            });

            res.json({
                success: true,
                message: 'Notification checks started for all students'
            });
        } catch (error) {
            console.error('Error starting checks:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to start notification checks',
                error: error.message
            });
        }
    }

    /**
     * Create mentor alert for student
     * POST /api/notifications/mentor-alert
     */
    async createMentorAlert(req, res) {
        try {
            const { studentUsn, mentorName, reason } = req.body;

            if (!studentUsn || !mentorName || !reason) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            await notificationEngine.createMentorAlert(studentUsn, mentorName, reason);

            res.json({
                success: true,
                message: 'Mentor alert created successfully'
            });
        } catch (error) {
            console.error('Error creating mentor alert:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create mentor alert',
                error: error.message
            });
        }
    }
}

module.exports = new NotificationController();
