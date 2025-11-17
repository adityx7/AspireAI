import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/organisms/NavBar';
import HomePage from './components/pages/Home';
import Contact from './components/pages/Contact';
import SimpleLogin from './components/pages/SimpleLogin';
import SimpleStudentRegister from './components/pages/SimpleStudentRegister';
import MentorSignInPage from './components/pages/MentorLoginFixed';
import MentorRegister from './components/pages/mentor/MentorRegister';
import Dashboard from './components/pages/Dashboard';
import Documents from './components/pages/Documents';
import Settings from './components/pages/Settings';
import ContactDash from './components/pages/ContactDash';
import Mentors from './components/pages/Mentors';
import MentorMain from './components/pages/MentorMain';
import MentorContact from './components/pages/MentorContact';
import SettingsMentor from './components/pages/SettingsMentor';
import ProfilePage from './components/pages/Profile';
import { AuthProvider } from './components/pages/AuthContext';
import MentorProfile from './components/pages/ProfileMentor';
import Academics from './components/pages/StudentDashboard/Academics';
import InternalMarksOverview from './components/pages/StudentDashboard/InternalMarksOverview';
import SemesterInternalMarks from './components/pages/StudentDashboard/SemesterInternalMarks';
import SemesterMarksPage from './components/pages/StudentDashboard/SemesterMarksPage';
import StudentMeetingNotesPage from './components/pages/StudentMeetingNotesPage';
import MentorMeetingNotesPage from './components/pages/MentorMeetingNotesPage';
import MeetingNotesTestPage from './components/pages/MeetingNotesTestPage';
import StudyPlanPage from './components/pages/StudyPlanPage';
import MentorStudentVerificationPage from './components/pages/mentor/MentorStudentVerificationPage';
import MentorStudentsListPage from './components/pages/mentor/MentorStudentsListPage';
import NotificationCenterPage from './components/pages/NotificationCenterPage';
import AdminLogin from './components/pages/AdminLogin';
import AdminSignup from './components/pages/AdminSignup';
import AdminDashboard from './components/pages/AdminDashboard';
import AdminStudentsList from './components/pages/AdminStudentsList';
import AdminStudentDetails from './components/pages/AdminStudentDetails';
import AdminEditStudent from './components/pages/AdminEditStudent';
import AdminProfile from './components/pages/AdminProfile';
import AdminPreferences from './components/pages/AdminPreferences';
import AdminPermissions from './components/pages/AdminPermissions';
import AdminAddStudent from './components/pages/AdminAddStudent';
import AdminBulkUpload from './components/pages/AdminBulkUpload';
import AdminReports from './components/pages/AdminReports';

export default function App() {
  return (
    < AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/mentor-login" element={<MentorSignInPage />} />
          <Route path="/mentor/register" element={<MentorRegister />} />
          <Route path="/student/register" element={<SimpleStudentRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/semester-marks/:semester" element={<SemesterMarksPage />} />
          <Route path="/internal-marks" element={<InternalMarksOverview />} />
          <Route path="/internal-marks/semester/:semester" element={<SemesterInternalMarks />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contact-us" element={< ContactDash />} />
          <Route path="/meeting-notes" element={<StudentMeetingNotesPage />} />
          <Route path="/test-meeting-notes" element={<MeetingNotesTestPage />} />
          <Route path="/study-plan" element={<StudyPlanPage />} />
          <Route path="/dashboard-mentor" element={< MentorMain />} />
          <Route path="/mentor-main" element={< MentorMain />} />
          <Route path="/settings-mentor" element={<SettingsMentor />} />
          <Route path="/contact-mentor" element={< MentorContact title = {"Contact us"} />} />
          <Route path="/profile-mentor" element={<MentorProfile />} />
          <Route path="/mentor-meeting-notes" element={<MentorMeetingNotesPage />} />
          <Route path="/mentor/students-verification" element={<MentorStudentsListPage />} />
          <Route path="/mentor/verify-student/:studentId" element={<MentorStudentVerificationPage />} />
          <Route path="/notifications" element={<NotificationCenterPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudentsList />} />
          <Route path="/admin/students/:studentId" element={<AdminStudentDetails />} />
          <Route path="/admin/students/:studentId/edit" element={<AdminEditStudent />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/preferences" element={<AdminPreferences />} />
          <Route path="/admin/permissions" element={<AdminPermissions />} />
          <Route path="/admin/add-student" element={<AdminAddStudent />} />
          <Route path="/admin/bulk-upload" element={<AdminBulkUpload />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
