const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET || 'aspirai-secret-key-2024';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '') || 
                     req.header('x-auth-token') ||
                     req.cookies?.token;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No authentication token provided' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email,
            name: decoded.name
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
};

/**
 * Role-Based Access Control Middleware
 * Checks if user has required role(s)
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not authenticated' 
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}` 
            });
        }

        next();
    };
};

/**
 * Admin-Only Middleware
 * Shorthand for authorize('admin', 'hod', 'coordinator')
 */
const adminOnly = authorize('admin', 'hod', 'coordinator');

/**
 * Permission-Based Access Control
 * Checks if admin has specific permission
 */
const requirePermission = (...requiredPermissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'User not authenticated' 
                });
            }

            // Students don't have permissions
            if (req.user.role === 'student') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied. Admin privileges required.' 
                });
            }

            // Fetch admin to check permissions
            const admin = await Admin.findOne({ 
                $or: [
                    { employeeId: req.user.userId },
                    { _id: req.user.userId }
                ]
            });

            if (!admin) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Admin account not found' 
                });
            }

            // Check if admin has at least one required permission
            const hasPermission = requiredPermissions.some(perm => 
                admin.permissions.includes(perm)
            );

            if (!hasPermission) {
                return res.status(403).json({ 
                    success: false, 
                    message: `Insufficient permissions. Required: ${requiredPermissions.join(' or ')}` 
                });
            }

            // Attach admin info to request
            req.admin = admin;
            next();
        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error checking permissions' 
            });
        }
    };
};

/**
 * Generate JWT Token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.userId || user._id || user.employeeId,
            role: user.role,
            email: user.email,
            name: user.fullName || user.name
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

/**
 * Middleware to log admin actions
 */
const logAdminAction = (actionType) => {
    return (req, res, next) => {
        // Store original send function
        const originalSend = res.send;
        
        // Override send to capture response
        res.send = function(data) {
            // Only log if action was successful
            if (res.statusCode >= 200 && res.statusCode < 300) {
                req.adminAction = {
                    actionType,
                    timestamp: new Date()
                };
            }
            
            // Call original send
            originalSend.call(this, data);
        };
        
        next();
    };
};

module.exports = {
    authenticate,
    authorize,
    adminOnly,
    requirePermission,
    generateToken,
    logAdminAction
};
