import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/organisms/NavBar';
import HomePage from './components/pages/Home';
import Contact from './components/pages/Contact';
import SimpleLogin from './components/pages/SimpleLogin';
import SimpleStudentRegister from './components/pages/SimpleStudentRegister';
import MentorLogin from './components/pages/MentorLogin';
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

export default function App() {
  return (
    < AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/mentor-login" element={<MentorLogin />} />
          <Route path="/student/register" element={<SimpleStudentRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contact-us" element={< ContactDash />} />
          <Route path="/dashboard-mentor" element={< MentorMain />} />
          <Route path="/settings-mentor" element={<SettingsMentor />} />
          <Route path="/contact-mentor" element={< MentorContact title = {"Contact us"} />} />
          <Route path="/profile-mentor" element={<MentorProfile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
