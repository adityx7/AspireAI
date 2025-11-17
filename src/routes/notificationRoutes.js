const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications for a user
router.get('/:userId', notificationController.getNotifications);

// Get unread count
router.get('/:userId/unread-count', notificationController.getUnreadCount);

// Create a notification
router.post('/', notificationController.createNotification);

// Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all notifications as read for a user
router.put('/:userId/mark-all-read', notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

// Run notification checks for a specific student
router.post('/check/:userId', notificationController.runChecksForStudent);

// Run notification checks for all students (admin only)
router.post('/check-all', notificationController.runChecksForAllStudents);

// Create mentor alert
router.post('/mentor-alert', notificationController.createMentorAlert);

module.exports = router;
