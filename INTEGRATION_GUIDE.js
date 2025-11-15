/**
 * Integration Example: Adding Semester Academics to Dashboard
 * 
 * This file shows how to integrate the new semester-based academic components
 * into your existing AspireAI student dashboard.
 */

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AcademicsOverview from './components/pages/StudentDashboard/AcademicsOverview';
import SemesterPage from './components/pages/StudentDashboard/SemesterPage';

/**
 * OPTION 1: Replace existing Academics component
 * 
 * If you currently have an Academics.js component, simply replace it:
 */

// Old way (combined academics):
// import Academics from './components/pages/StudentDashboard/Academics';

// New way (semester-wise):
import AcademicsOverview from './components/pages/StudentDashboard/AcademicsOverview';

function DashboardRoutes() {
  const userId = localStorage.getItem('userId'); // Or from your auth context
  
  return (
    <Routes>
      {/* ... other routes ... */}
      
      {/* Replace old academics route */}
      <Route 
        path="/academics" 
        element={<AcademicsOverview userId={userId} />} 
      />
      
      {/* ... other routes ... */}
    </Routes>
  );
}

/**
 * OPTION 2: Add as new route alongside existing academics
 * 
 * Keep both old and new systems during transition:
 */

function DashboardRoutesTransition() {
  const userId = localStorage.getItem('userId');
  
  return (
    <Routes>
      {/* Old academics (keep for now) */}
      <Route 
        path="/academics-old" 
        element={<OldAcademics userId={userId} />} 
      />
      
      {/* New semester-based academics */}
      <Route 
        path="/academics" 
        element={<AcademicsOverview userId={userId} />} 
      />
      
      {/* Specific semester page */}
      <Route 
        path="/academics/semester/:semesterNum" 
        element={<SemesterPageWrapper userId={userId} />} 
      />
    </Routes>
  );
}

// Wrapper to extract semester from URL params
function SemesterPageWrapper({ userId }) {
  const { semesterNum } = useParams();
  const navigate = useNavigate();
  
  return (
    <SemesterPage 
      userId={userId}
      semester={parseInt(semesterNum)}
      onBack={() => navigate('/academics')}
    />
  );
}

/**
 * OPTION 3: Add to dashboard navigation menu
 * 
 * Update your sidebar/navbar component:
 */

function NavigationMenu() {
  return (
    <nav>
      {/* ... other menu items ... */}
      
      <NavLink to="/academics">
        <SchoolIcon />
        <span>Academics (Semester-wise)</span>
      </NavLink>
      
      {/* ... other menu items ... */}
    </nav>
  );
}

/**
 * OPTION 4: Feature flag for gradual rollout
 * 
 * Use environment variable to control which system users see:
 */

function SmartAcademicsRoute() {
  const userId = localStorage.getItem('userId');
  const useSemesterSystem = process.env.REACT_APP_USE_SEMESTER_ACADEMICS === 'true';
  
  return (
    <Route 
      path="/academics" 
      element={
        useSemesterSystem 
          ? <AcademicsOverview userId={userId} />
          : <OldAcademics userId={userId} />
      } 
    />
  );
}

/**
 * EXAMPLE: Complete Dashboard Integration
 */

import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AcademicsOverview from './components/pages/StudentDashboard/AcademicsOverview';

function StudentDashboard() {
  const navigate = useNavigate();
  const [userId] = useState(localStorage.getItem('userId'));

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Academics', icon: <SchoolIcon />, path: '/academics' },
    { text: 'Mentors', icon: <PeopleIcon />, path: '/mentors' },
    { text: 'Analysis', icon: <AssessmentIcon />, path: '/analysis' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer variant="permanent" sx={{ width: 240 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/academics" element={<AcademicsOverview userId={userId} />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default StudentDashboard;

/**
 * INTEGRATION CHECKLIST
 * 
 * ✅ 1. Enable feature in .env:
 *       USE_SEMESTER_ACADEMICS=true
 * 
 * ✅ 2. Ensure backend routes are loaded (check server logs)
 * 
 * ✅ 3. Import AcademicsOverview component in your dashboard
 * 
 * ✅ 4. Add route: <Route path="/academics" element={<AcademicsOverview userId={userId} />} />
 * 
 * ✅ 5. Update navigation menu to link to /academics
 * 
 * ✅ 6. (Optional) Run migration if you have existing data:
 *       node scripts/migrate_academics_to_semesters.js --apply
 * 
 * ✅ 7. Test the flow:
 *       - View semester cards
 *       - Click a semester
 *       - Edit course marks
 *       - Save changes
 *       - Export to PDF
 * 
 * ✅ 8. Monitor backend logs for any errors
 * 
 * ✅ 9. Check MongoDB for created documents:
 *       db.academicsemesters.find()
 */

/**
 * BACKWARD COMPATIBILITY
 * 
 * To maintain backward compatibility with old APIs:
 */

// Add this endpoint in your backend to aggregate semester data
app.get('/api/students/:id/academics-combined', async (req, res) => {
  try {
    const { id } = req.params;
    const semesters = await AcademicSemester.find({ userId: id }).sort({ semester: 1 });
    
    // Transform to old format
    const combinedData = {
      userId: id,
      allSemesters: semesters,
      cgpa: await recomputeCGPA(id),
      totalCourses: semesters.reduce((sum, sem) => sum + sem.courses.length, 0)
    };
    
    res.json({ success: true, data: combinedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * CUSTOMIZATION TIPS
 * 
 * 1. Change colors in AcademicsOverview.jsx:
 *    - Card colors: Update getSemesterColor() function
 *    - Header gradient: Modify background prop
 * 
 * 2. Modify grade calculation:
 *    - Edit computeCourseGrades() in academicsService.js
 *    - Adjust weightages for IA/Lab/Other marks
 * 
 * 3. Add custom fields:
 *    - Update AcademicSemester model schema
 *    - Add columns in SemesterPage table
 *    - Update validation schema
 * 
 * 4. Change semester count (default is 8):
 *    - Update max semester validation in schema
 *    - Modify semester loop in AcademicsOverview
 */

/**
 * DEPLOYMENT NOTES
 * 
 * Before deploying to production:
 * 
 * 1. Run full test suite
 * 2. Backup database
 * 3. Run migration in staging first
 * 4. Test all API endpoints
 * 5. Verify frontend rendering
 * 6. Check mobile responsiveness
 * 7. Test export functionality
 * 8. Monitor performance with sample data
 * 9. Set up error tracking
 * 10. Document rollback procedure
 */
