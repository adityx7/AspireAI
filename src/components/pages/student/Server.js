// Load environment variables from .env file
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/mentorship_platform", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
}
connectDB();

// ✅ User Schema (Only for student login)
const userSchema = new mongoose.Schema({
    fullName: String,
    usn: String,
    email: String,
    password: String,
});
const User = mongoose.model("User", userSchema);

// ✅ Mentor Schema (Updated for Phase 1)
const mentorSchema = new mongoose.Schema({
    fullName: String,
    mentorID: String,
    email: String,
    password: String,
    
    // ✅ Phase 1: New field to link assigned students
    menteeIDs: [{ 
        type: String, // Student USN references
        ref: 'Student'
    }],
    
    // Additional mentor-specific fields
    expertise: [String], // Areas of expertise
    maxMentees: { type: Number, default: 10 }, // Maximum number of students a mentor can handle
    availabilityStatus: { 
        type: String, 
        enum: ['Available', 'Busy', 'Unavailable'], 
        default: 'Available' 
    }
});
const Mentor = mongoose.model("Mentor", mentorSchema);

// ✅ Student Model - Imported from models folder
const Student = require('../../../models/Student');

// ✅ Mentor Meeting Notes Schema
const meetingNotesSchema = new mongoose.Schema({
    mentorID: { type: String, required: true, ref: 'Mentor' },
    studentUSN: { type: String, required: true, ref: 'Student' },
    meetingDate: { type: Date, required: true },
    summary: { type: String, required: true, maxlength: 500 },
    actionItems: [{
        item: { type: String, required: true, maxlength: 200 },
        priority: { 
            type: String, 
            enum: ['High', 'Medium', 'Low'], 
            default: 'Medium' 
        },
        dueDate: Date,
        status: { 
            type: String, 
            enum: ['Pending', 'In Progress', 'Completed'], 
            default: 'Pending' 
        },
        studentNotes: String, // Notes added by student
        completedAt: Date
    }],
    mentorNotes: { type: String, maxlength: 1000 }, // Additional mentor observations
    nextMeetingDate: Date,
    tags: [String], // e.g., ['Academic', 'Career', 'Personal Development']
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    timestamps: true,
    collection: "meeting_notes" 
});

// Index for faster queries
meetingNotesSchema.index({ mentorID: 1, studentUSN: 1, meetingDate: -1 });
meetingNotesSchema.index({ studentUSN: 1, createdAt: -1 });

const MeetingNotes = mongoose.model("MeetingNotes", meetingNotesSchema);

/* -----------------------------------
   ✅ Mentor APIs
-------------------------------------*/
app.post("/api/mentors/register", async (req, res) => {
    try {
        console.log("📩 Mentor Registration Request Received:", req.body);
        const { fullName, mentorID, email, password, phoneNumber, alternatePhoneNumber, gender, tech, employeeIn, selectedMajors, bio } = req.body;

        console.log("🔍 Checking if mentor already exists...");
        // Check if mentor exists
        const existingMentor = await Mentor.findOne({ $or: [{ mentorID }, { email }] });
        if (existingMentor) {
            console.log("❌ Mentor already exists:", existingMentor.mentorID);
            return res.status(400).json({ success: false, message: "Mentor ID or Email already registered" });
        }

        console.log("✅ Mentor doesn't exist, creating new mentor...");
        // ✅ Store Mentor Authentication Info
        const newMentor = new Mentor({ fullName, mentorID, email, password });
        await newMentor.save();
        console.log("✅ Mentor saved successfully:", mentorID);

        // ✅ Store Mentor Profile Details (only if additional fields are provided)
        if (phoneNumber || alternatePhoneNumber || gender || tech || employeeIn || selectedMajors || bio) {
            console.log("📝 Creating mentor details...");
            const newMentorDetails = new MentorDetails({
                mentorID,
                fullName,
                phoneNumber: phoneNumber || '',
                alternatePhoneNumber: alternatePhoneNumber || '',
                email,
                gender: gender || '',
                tech: tech || '',
                employeeIn: employeeIn || '',
                selectedMajors: selectedMajors || '',
                bio: bio || '', 
            });
            await newMentorDetails.save();
        }

        console.log("✅ Mentor registered successfully:", mentorID);
        res.status(201).json({ success: true, message: "Mentor Registered Successfully" });
    } catch (error) {
        console.error("❌ Registration error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

const mentorDetailsSchema = new mongoose.Schema({
    mentorID: { type: String, required: true, unique: true },
    fullName: String,
    phoneNumber: String,
    alternatePhoneNumber: String,
    email: String,
    gender: String,
    employeeIn: String,  // Company/Organization Name
    selectedMajors: String, // Array of selected majors
    bio: String, 
    tech: String
}, { collection: "mentor_details" });

const MentorDetails = mongoose.model("MentorDetails", mentorDetailsSchema);

// GET endpoint for fetching mentor profile
app.get("/api/mentors/:mentorID", async (req, res) => {
    try {
        const { mentorID } = req.params;
        console.log("📩 GET - Fetching mentor details for:", mentorID);

        const mentorDetails = await MentorDetails.findOne({ mentorID });
        console.log("🎯 Mentor Details Found:", mentorDetails);

        if (!mentorDetails) {
            return res.status(404).json({ message: "Mentor profile not found" });
        }

        res.json(mentorDetails);
    } catch (error) {
        console.error("❌ Error fetching mentor details:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// POST endpoint for updating mentor profile (keeping for backwards compatibility)
app.post("/api/mentors/:mentorID", async (req, res) => {
    try {
        const { mentorID } = req.params;
        console.log("📩 POST - Fetching mentor details for:", mentorID);

        const mentorDetails = await MentorDetails.findOne({ mentorID });
        console.log("🎯 Mentor Details Found:", mentorDetails);

        if (!mentorDetails) {
            return res.status(404).json({ message: "Mentor profile not found" });
        }

        res.json(mentorDetails);
    } catch (error) {
        console.error("❌ Error fetching mentor details:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.post("/api/mentors/login", async (req, res) => {
    try {
        console.log("📩 Mentor Login Request Received:", req.body);
        const { mentorID, password } = req.body;

        if (!mentorID || !password) {
            console.log("❌ Missing mentorID or password");
            return res.status(400).json({ success: false, message: "Missing mentorID or password" });
        }

        console.log("🔍 Searching for mentor with ID:", mentorID);
        const mentor = await Mentor.findOne({ mentorID: String(mentorID) });
        console.log("🎯 Mentor found:", mentor ? "Yes" : "No");

        if (!mentor) {
            console.log("❌ Mentor not found");
            return res.status(400).json({ success: false, message: "Mentor not found. Please check your Mentor ID." });
        }

        if (mentor.password !== password) {
            console.log("❌ Invalid password");
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        console.log("✅ Login successful for mentor:", mentorID);
        res.json({ success: true, message: "Login successful", mentorID, mentor: { fullName: mentor.fullName, email: mentor.email } });
    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// ✅ Admin Login (Added for Admin Panel)
app.post("/api/admin/login", async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const jwt = require('jsonwebtoken');
        const Admin = require('../../../models/Admin');
        const JWT_SECRET = process.env.JWT_SECRET || 'aspirai-secret-key-2024';
        
        console.log("📩 Admin Login Request Received:", req.body);
        const { employeeId, password } = req.body;

        if (!employeeId || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing employeeId or password" 
            });
        }

        // Find admin by employeeId
        const admin = await Admin.findOne({ employeeId: String(employeeId) });

        if (!admin) {
            console.log("❌ Admin not found");
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({ 
                success: false, 
                message: "Account is inactive. Contact system administrator." 
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log("❌ Invalid password");
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: admin.employeeId,
                role: admin.role,
                email: admin.email,
                name: admin.fullName
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        console.log("✅ Admin login successful:", employeeId);
        
        res.json({ 
            success: true, 
            message: "Login successful",
            token,
            admin: {
                employeeId: admin.employeeId,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role,
                department: admin.department,
                permissions: admin.permissions
            }
        });
    } catch (error) {
        console.error("❌ Admin login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

// ✅ Admin Registration (Added for Admin Panel)
app.post("/api/admin/register", async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const Admin = require('../../../models/Admin');
        
        console.log("📩 Admin Registration Request Received:", req.body);
        const { employeeId, fullName, email, password, department, role, permissions } = req.body;

        // Validation
        if (!employeeId || !fullName || !email || !password || !department) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields" 
            });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ 
            $or: [
                { employeeId: String(employeeId) },
                { email: email.toLowerCase() }
            ]
        });

        if (existingAdmin) {
            return res.status(409).json({ 
                success: false, 
                message: "Admin with this Employee ID or Email already exists" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const newAdmin = new Admin({
            employeeId: String(employeeId),
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            department,
            role: role || 'admin',
            permissions: permissions || ['view_students', 'manage_marks'],
            isActive: true
        });

        await newAdmin.save();

        console.log("✅ Admin registration successful:", employeeId);
        
        res.status(201).json({ 
            success: true, 
            message: "Admin account created successfully",
            admin: {
                employeeId: newAdmin.employeeId,
                fullName: newAdmin.fullName,
                email: newAdmin.email,
                role: newAdmin.role,
                department: newAdmin.department,
                permissions: newAdmin.permissions
            }
        });
    } catch (error) {
        console.error("❌ Admin registration error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

app.post("/api/mentor/details", async (req, res) => {
    try {
        console.log("📩 Received Mentor Details:", req.body);

        const { mentorID, fullName, phoneNumber, alternatePhoneNumber, email, gender, tech, employeeIn, selectedMajors, bio } = req.body;

        if (!mentorID) return res.status(400).json({ message: "mentorID is required" });

        // ✅ Check if mentor already exists
        const existingMentor = await MentorDetails.findOne({ mentorID });
        if (existingMentor) {
            // Update existing mentor details instead of returning error
            console.log("📝 Updating existing mentor details for:", mentorID);
            existingMentor.fullName = fullName || existingMentor.fullName;
            existingMentor.phoneNumber = phoneNumber || existingMentor.phoneNumber;
            existingMentor.alternatePhoneNumber = alternatePhoneNumber || existingMentor.alternatePhoneNumber;
            existingMentor.email = email || existingMentor.email;
            existingMentor.gender = gender || existingMentor.gender;
            existingMentor.tech = tech || existingMentor.tech;
            existingMentor.employeeIn = employeeIn || existingMentor.employeeIn;
            existingMentor.selectedMajors = selectedMajors || existingMentor.selectedMajors;
            existingMentor.bio = bio || existingMentor.bio;
            
            await existingMentor.save();
            console.log("✅ Mentor Details Updated:", existingMentor);
            return res.status(200).json({ success: true, message: "Mentor details updated successfully" });
        }

        // ✅ Create new mentor details
        const newMentorDetails = new MentorDetails({
            mentorID,
            fullName,
            phoneNumber,
            alternatePhoneNumber,
            email,
            gender,
            tech,
            employeeIn,
            selectedMajors,
            bio
        });

        await newMentorDetails.save();
        console.log("✅ Mentor Details Saved:", newMentorDetails);
        res.status(201).json({ success: true, message: "Mentor details stored successfully" });
    } catch (error) {
        console.error("❌ Error storing mentor details:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.get("/api/mentor/details", async (req, res) => {
    try {
        const mentors = await MentorDetails.find({}, "mentorID fullName selectedMajors bio tech");
        res.json(mentors);
    } catch (error) {
        console.error("❌ Error fetching mentors:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Student chooses a mentor
app.post("/api/students/choose-mentor", async (req, res) => {
    try {
        const { usn, mentorID } = req.body;
        console.log("📩 Student choosing mentor:", { usn, mentorID });

        if (!usn || !mentorID) {
            return res.status(400).json({ 
                success: false, 
                message: "USN and mentorID are required" 
            });
        }

        // Find the student
        const student = await Student.findOne({ usn });
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found" 
            });
        }

        // Find the mentor
        const mentor = await Mentor.findOne({ mentorID });
        if (!mentor) {
            return res.status(404).json({ 
                success: false, 
                message: "Mentor not found" 
            });
        }

        // Check if mentor already has this student
        if (!mentor.menteeIDs.includes(usn)) {
            mentor.menteeIDs.push(usn);
            await mentor.save();
        }

        // Update student's assigned mentor (if student schema has this field)
        if (student.academics) {
            student.academics.assignedMentor = mentorID;
            await student.save();
        }

        const mentorDetails = await MentorDetails.findOne({ mentorID });
        
        res.json({ 
            success: true, 
            message: `${mentorDetails?.fullName || mentorID} is now your mentor!`,
            mentor: {
                mentorID,
                fullName: mentorDetails?.fullName,
                tech: mentorDetails?.tech
            }
        });
    } catch (error) {
        console.error("❌ Error choosing mentor:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

/* -----------------------------------
   ✅ Phase 2: Academics APIs
-------------------------------------*/

// ✅ Add/Update semester academic data
app.post("/api/academics/semester", async (req, res) => {
    try {
        const { 
            usn, 
            semesterNumber, 
            cgpa, 
            semesterCourses, 
            reflectionJournal 
        } = req.body;

        console.log("📩 Semester data received for USN:", usn);

        if (!usn || !semesterNumber) {
            return res.status(400).json({ 
                success: false, 
                message: "USN and semester number are required" 
            });
        }

        // Find the student
        const student = await Student.findOne({ usn });
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found" 
            });
        }

        // Initialize academics object if it doesn't exist
        if (!student.academics) {
            student.academics = { semesters: [], overallCGPA: 0, totalCredits: 0 };
        }

        // Check if semester already exists
        const existingSemesterIndex = student.academics.semesters.findIndex(
            sem => sem.semesterNumber === semesterNumber
        );

        const semesterData = {
            semesterNumber,
            cgpa: cgpa || 0,
            semesterCourses: semesterCourses || [],
            reflectionJournal: reflectionJournal || {}
        };

        if (existingSemesterIndex !== -1) {
            // Update existing semester
            student.academics.semesters[existingSemesterIndex] = semesterData;
        } else {
            // Add new semester
            student.academics.semesters.push(semesterData);
        }

        // Calculate overall CGPA and total credits
        let totalCGPA = 0;
        let totalCredits = 0;
        
        student.academics.semesters.forEach(semester => {
            if (semester.cgpa) {
                totalCGPA += semester.cgpa;
            }
            semester.semesterCourses.forEach(course => {
                if (course.credits) {
                    totalCredits += course.credits;
                }
            });
        });

        student.academics.overallCGPA = student.academics.semesters.length > 0 
            ? totalCGPA / student.academics.semesters.length 
            : 0;
        student.academics.totalCredits = totalCredits;

        await student.save();

        res.status(200).json({ 
            success: true, 
            message: "Academic data updated successfully",
            data: student.academics
        });

    } catch (error) {
        console.error("❌ Error updating academic data:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

// ✅ Fetch all academic data for dashboard
app.get("/api/academics/dashboard/:usn", async (req, res) => {
    try {
        const { usn } = req.params;

        console.log("📩 Fetching academic dashboard for USN:", usn);

        const student = await Student.findOne({ usn }).select(
            'academics attendance certifications aictActivityPoints swotAnalysis careerInterests careerRoadmap name usn'
        );

        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found" 
            });
        }

        // Initialize empty objects if they don't exist
        const academicData = {
            studentInfo: {
                name: student.name,
                usn: student.usn
            },
            academics: student.academics || { semesters: [], overallCGPA: 0, totalCredits: 0 },
            attendance: student.attendance || [],
            certifications: student.certifications || [],
            aictActivityPoints: student.aictActivityPoints || { 
                currentPoints: 0, 
                targetPoints: 100, 
                activities: [] 
            },
            swotAnalysis: student.swotAnalysis || {
                strengths: [],
                weaknesses: [],
                opportunities: [],
                threats: []
            },
            careerInterests: student.careerInterests || [],
            careerRoadmap: student.careerRoadmap || []
        };

        res.status(200).json({ 
            success: true, 
            data: academicData 
        });

    } catch (error) {
        console.error("❌ Error fetching academic dashboard:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

// ✅ Add/Update internal marks data
app.post("/api/academics/internals", async (req, res) => {
    try {
        const { usn, subjectCode, subjectName, semesterNumber, ia1, ia2, ia3, average, semesterEndMarks } = req.body;

        if (!usn || !subjectCode || !subjectName || !semesterNumber) {
            return res.status(400).json({ 
                success: false, 
                message: "USN, subject code, subject name, and semester number are required" 
            });
        }

        // Validate IA marks
        if (ia1 > 30 || ia2 > 30 || ia3 > 30 || ia1 < 0 || ia2 < 0 || ia3 < 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Each IA mark must be between 0 and 30" 
            });
        }

        // Validate semester end marks if provided
        if (semesterEndMarks !== undefined && (semesterEndMarks > 100 || semesterEndMarks < 0)) {
            return res.status(400).json({ 
                success: false, 
                message: "Semester end marks must be between 0 and 100" 
            });
        }

        const student = await Student.findOne({ usn });
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found" 
            });
        }

        if (!student.academics) {
            student.academics = {};
        }

        if (!student.academics.internalMarks) {
            student.academics.internalMarks = [];
        }

        // Check if internal marks record for this subject and semester already exists
        const existingInternalIndex = student.academics.internalMarks.findIndex(
            internal => internal.subjectCode === subjectCode && internal.semesterNumber === semesterNumber
        );

        const internalData = {
            subjectCode,
            subjectName,
            semesterNumber,
            ia1: ia1 || 0,
            ia2: ia2 || 0,
            ia3: ia3 || 0,
            average: average || 0,
            updatedAt: new Date()
        };

        // Add semester end marks if provided
        if (semesterEndMarks !== undefined) {
            internalData.semesterEndMarks = semesterEndMarks;
        }

        if (existingInternalIndex !== -1) {
            // Update existing record
            student.academics.internalMarks[existingInternalIndex] = internalData;
        } else {
            // Add new record
            student.academics.internalMarks.push(internalData);
        }

        await student.save();

        res.json({ 
            success: true, 
            message: existingInternalIndex !== -1 ? "Subject marks updated successfully" : "Subject marks added successfully",
            data: internalData
        });

    } catch (error) {
        console.error("Error adding/updating internal marks:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

// ✅ Add/Update attendance data
app.post("/api/academics/attendance", async (req, res) => {
    try {
        const { usn, subjectName, attendedClasses, totalClasses, semester } = req.body;

        if (!usn || !subjectName) {
            return res.status(400).json({ 
                success: false, 
                message: "USN and subject name are required" 
            });
        }

        const student = await Student.findOne({ usn });
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found" 
            });
        }

        if (!student.attendance) {
            student.attendance = [];
        }

        // Check if attendance record for this subject already exists
        const existingAttendanceIndex = student.attendance.findIndex(
            att => att.subjectName === subjectName && att.semester === semester
        );

        const attendancePercentage = totalClasses > 0 
            ? (attendedClasses / totalClasses) * 100 
            : 0;

        const attendanceData = {
            subjectName,
            attendedClasses: attendedClasses || 0,
            totalClasses: totalClasses || 0,
            semester: semester || 1,
            attendancePercentage: parseFloat(attendancePercentage.toFixed(2))
        };

        if (existingAttendanceIndex !== -1) {
            student.attendance[existingAttendanceIndex] = attendanceData;
        } else {
            student.attendance.push(attendanceData);
        }

        await student.save();

        res.status(200).json({ 
            success: true, 
            message: "Attendance updated successfully",
            data: student.attendance
        });

    } catch (error) {
        console.error("❌ Error updating attendance:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

// ✅ Add certification
app.post("/api/academics/certification", async (req, res) => {
    try {
        const { usn, name, issuer, date, domainTags, verificationLink } = req.body;

        if (!usn || !name || !issuer || !date) {
            return res.status(400).json({ 
                success: false, 
                message: "USN, certification name, issuer, and date are required" 
            });
        }

        const student = await Student.findOne({ usn });
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found" 
            });
        }

        if (!student.certifications) {
            student.certifications = [];
        }

        const certificationData = {
            name,
            issuer,
            date: new Date(date),
            domainTags: domainTags || [],
            verificationLink: verificationLink || ""
        };

        student.certifications.push(certificationData);
        await student.save();

        res.status(200).json({ 
            success: true, 
            message: "Certification added successfully",
            data: student.certifications
        });

    } catch (error) {
        console.error("❌ Error adding certification:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

// ✅ Update total credits
app.put("/api/academics/credits", async (req, res) => {
    try {
        const { usn, credits } = req.body;

        if (!usn || credits === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: "USN and credits are required" 
            });
        }

        const student = await Student.findOne({ usn });
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found" 
            });
        }

        // Initialize academics object if it doesn't exist
        if (!student.academics) {
            student.academics = { semesters: [], overallCGPA: 0, totalCredits: 0 };
        }

        student.academics.totalCredits = parseInt(credits);
        await student.save();

        res.status(200).json({ 
            success: true, 
            message: "Total credits updated successfully",
            data: { totalCredits: student.academics.totalCredits }
        });

    } catch (error) {
        console.error("❌ Error updating credits:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

// ✅ Add activity points
app.post("/api/academics/activity", async (req, res) => {
    try {
        const { usn, activity, points, description } = req.body;

        if (!usn || !activity || !points) {
            return res.status(400).json({ 
                success: false, 
                message: "USN, activity name, and points are required" 
            });
        }

        const student = await Student.findOne({ usn });
        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: "Student not found" 
            });
        }

        // Initialize aictActivityPoints if it doesn't exist
        if (!student.aictActivityPoints) {
            student.aictActivityPoints = {
                currentPoints: 0,
                targetPoints: 100,
                activities: []
            };
        }

        const activityData = {
            name: activity,
            type: 'Academic', // Default type
            points: parseInt(points),
            status: 'Completed',
            dateCompleted: new Date(),
            description: description || ""
        };

        student.aictActivityPoints.activities.push(activityData);
        
        // Update current points
        student.aictActivityPoints.currentPoints += parseInt(points);

        await student.save();

        res.status(200).json({ 
            success: true, 
            message: "Activity points added successfully",
            data: student.aictActivityPoints
        });

    } catch (error) {
        console.error("❌ Error adding activity points:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
});

// ✅ Test route to create sample student data
app.post("/api/test/create-student", async (req, res) => {
    try {
        const testStudent = new Student({
            name: "Aditya",
            usn: "1BG21CS001",
            email: "aditya@test.com",
            academics: {
                semesters: [],
                overallCGPA: 8.49,
                totalCredits: 0
            },
            certifications: [],
            aictActivityPoints: {
                currentPoints: 0,
                targetPoints: 100,
                activities: []
            }
        });

        await testStudent.save();

        res.status(200).json({ 
            success: true, 
            message: "Test student created successfully",
            data: testStudent
        });

    } catch (error) {
        // If student already exists, just return success
        if (error.code === 11000) {
            res.status(200).json({ 
                success: true, 
                message: "Test student already exists"
            });
        } else {
            console.error("❌ Error creating test student:", error);
            res.status(500).json({ 
                success: false, 
                message: "Server error", 
                error: error.message 
            });
        }
    }
});

/* -----------------------------------
   ✅ Meeting Notes APIs
-------------------------------------*/

// ✅ Get mentor's mentees list
app.get("/api/mentor/:mentorID/mentees", async (req, res) => {
    try {
        const { mentorID } = req.params;
        
        // Find mentor and populate mentee data
        const mentor = await Mentor.findOne({ mentorID }).select('menteeIDs');
        if (!mentor) {
            return res.status(404).json({ success: false, message: "Mentor not found" });
        }

        // Get student details for all mentees
        const mentees = await Student.find({ 
            usn: { $in: mentor.menteeIDs } 
        }).select('name usn email academics.overallCGPA');

        res.json({ success: true, mentees });
    } catch (error) {
        console.error("❌ Error fetching mentees:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

// ✅ Remove student from mentor's mentee list
app.delete("/api/mentor/:mentorID/mentee/:studentUSN", async (req, res) => {
    try {
        const { mentorID, studentUSN } = req.params;
        
        // Find mentor
        const mentor = await Mentor.findOne({ mentorID });
        if (!mentor) {
            return res.status(404).json({ success: false, message: "Mentor not found" });
        }

        // Check if student is in mentee list
        if (!mentor.menteeIDs.includes(studentUSN)) {
            return res.status(404).json({ 
                success: false, 
                message: "Student is not assigned to this mentor" 
            });
        }

        // Remove student from menteeIDs array
        mentor.menteeIDs = mentor.menteeIDs.filter(usn => usn !== studentUSN);
        await mentor.save();

        // Also update student's mentor field to null
        await Student.findOneAndUpdate(
            { usn: studentUSN },
            { $unset: { selectedMentor: "" } }
        );

        console.log(`✅ Removed student ${studentUSN} from mentor ${mentorID}'s mentee list`);
        
        res.json({ 
            success: true, 
            message: "Student removed from mentee list successfully",
            menteeIDs: mentor.menteeIDs 
        });
    } catch (error) {
        console.error("❌ Error removing mentee:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

// ✅ Create new meeting note (Mentor only)
app.post("/api/meeting-notes", async (req, res) => {
    try {
        const { 
            mentorID, 
            studentUSN, 
            meetingDate, 
            summary, 
            actionItems, 
            mentorNotes, 
            nextMeetingDate, 
            tags 
        } = req.body;

        // Validate required fields
        if (!mentorID || !studentUSN || !meetingDate || !summary) {
            return res.status(400).json({ 
                success: false, 
                message: "MentorID, studentUSN, meetingDate, and summary are required" 
            });
        }

        // Verify mentor exists and student is their mentee
        const mentor = await Mentor.findOne({ mentorID });
        if (!mentor) {
            return res.status(404).json({ success: false, message: "Mentor not found" });
        }

        if (!mentor.menteeIDs.includes(studentUSN)) {
            return res.status(403).json({ 
                success: false, 
                message: "Student is not assigned to this mentor" 
            });
        }

        // Create new meeting note
        const newMeetingNote = new MeetingNotes({
            mentorID,
            studentUSN,
            meetingDate: new Date(meetingDate),
            summary,
            actionItems: actionItems || [],
            mentorNotes,
            nextMeetingDate: nextMeetingDate ? new Date(nextMeetingDate) : null,
            tags: tags || []
        });

        await newMeetingNote.save();

        res.status(201).json({ 
            success: true, 
            message: "Meeting note created successfully", 
            meetingNote: newMeetingNote 
        });
    } catch (error) {
        console.error("❌ Error creating meeting note:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

// ✅ Get all meeting notes for a student (Student view)
app.get("/api/meeting-notes/student/:studentUSN", async (req, res) => {
    try {
        const { studentUSN } = req.params;
        
        const meetingNotes = await MeetingNotes.find({ studentUSN })
            .populate({
                path: 'mentorID',
                select: 'fullName',
                model: 'Mentor'
            })
            .sort({ meetingDate: -1 });

        // Get mentor details for each note
        const notesWithMentorDetails = await Promise.all(
            meetingNotes.map(async (note) => {
                const mentorDetails = await MentorDetails.findOne({ mentorID: note.mentorID });
                return {
                    ...note.toObject(),
                    mentorName: mentorDetails ? mentorDetails.fullName : 'Unknown Mentor'
                };
            })
        );

        res.json({ success: true, meetingNotes: notesWithMentorDetails });
    } catch (error) {
        console.error("❌ Error fetching student meeting notes:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

// ✅ Get all meeting notes for a mentor (Mentor view)
app.get("/api/meeting-notes/mentor/:mentorID", async (req, res) => {
    try {
        const { mentorID } = req.params;
        const { studentUSN } = req.query; // Optional filter by specific student
        
        let query = { mentorID };
        if (studentUSN) {
            query.studentUSN = studentUSN;
        }

        const meetingNotes = await MeetingNotes.find(query)
            .sort({ meetingDate: -1 });

        // Get student details for each note
        const notesWithStudentDetails = await Promise.all(
            meetingNotes.map(async (note) => {
                const student = await Student.findOne({ usn: note.studentUSN }).select('name');
                return {
                    ...note.toObject(),
                    studentName: student ? student.name : 'Unknown Student'
                };
            })
        );

        res.json({ success: true, meetingNotes: notesWithStudentDetails });
    } catch (error) {
        console.error("❌ Error fetching mentor meeting notes:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

// ✅ Update meeting note (Mentor only)
app.put("/api/meeting-notes/:noteId", async (req, res) => {
    try {
        const { noteId } = req.params;
        const { mentorID, summary, actionItems, mentorNotes, nextMeetingDate, tags } = req.body;

        // Find the meeting note
        const meetingNote = await MeetingNotes.findById(noteId);
        if (!meetingNote) {
            return res.status(404).json({ success: false, message: "Meeting note not found" });
        }

        // Verify mentor ownership
        if (meetingNote.mentorID !== mentorID) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized: You can only edit your own meeting notes" 
            });
        }

        // Update fields
        if (summary) meetingNote.summary = summary;
        if (actionItems) meetingNote.actionItems = actionItems;
        if (mentorNotes !== undefined) meetingNote.mentorNotes = mentorNotes;
        if (nextMeetingDate) meetingNote.nextMeetingDate = new Date(nextMeetingDate);
        if (tags) meetingNote.tags = tags;
        meetingNote.updatedAt = new Date();

        await meetingNote.save();

        res.json({ 
            success: true, 
            message: "Meeting note updated successfully", 
            meetingNote 
        });
    } catch (error) {
        console.error("❌ Error updating meeting note:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

// ✅ Delete meeting note (Mentor only)
app.delete("/api/meeting-notes/:noteId", async (req, res) => {
    try {
        const { noteId } = req.params;
        const { mentorID } = req.body;

        // Find the meeting note
        const meetingNote = await MeetingNotes.findById(noteId);
        if (!meetingNote) {
            return res.status(404).json({ success: false, message: "Meeting note not found" });
        }

        // Verify mentor ownership
        if (meetingNote.mentorID !== mentorID) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized: You can only delete your own meeting notes" 
            });
        }

        await MeetingNotes.findByIdAndDelete(noteId);

        res.json({ 
            success: true, 
            message: "Meeting note deleted successfully" 
        });
    } catch (error) {
        console.error("❌ Error deleting meeting note:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

// ✅ Update action item status (Student only)
app.put("/api/meeting-notes/:noteId/action-item/:actionIndex", async (req, res) => {
    try {
        const { noteId, actionIndex } = req.params;
        const { studentUSN, status, studentNotes } = req.body;

        // Find the meeting note
        const meetingNote = await MeetingNotes.findById(noteId);
        if (!meetingNote) {
            return res.status(404).json({ success: false, message: "Meeting note not found" });
        }

        // Verify student ownership
        if (meetingNote.studentUSN !== studentUSN) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized: You can only update your own action items" 
            });
        }

        // Validate action item index
        if (actionIndex < 0 || actionIndex >= meetingNote.actionItems.length) {
            return res.status(400).json({ success: false, message: "Invalid action item index" });
        }

        // Update action item
        const actionItem = meetingNote.actionItems[actionIndex];
        if (status) actionItem.status = status;
        if (studentNotes !== undefined) actionItem.studentNotes = studentNotes;
        if (status === 'Completed') actionItem.completedAt = new Date();

        meetingNote.updatedAt = new Date();
        await meetingNote.save();

        res.json({ 
            success: true, 
            message: "Action item updated successfully", 
            actionItem 
        });
    } catch (error) {
        console.error("❌ Error updating action item:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

// ✅ Get meeting statistics for mentor dashboard
app.get("/api/meeting-stats/mentor/:mentorID", async (req, res) => {
    try {
        const { mentorID } = req.params;

        // Get total meetings count
        const totalMeetings = await MeetingNotes.countDocuments({ mentorID });

        // Get meetings this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const meetingsThisMonth = await MeetingNotes.countDocuments({
            mentorID,
            meetingDate: { $gte: startOfMonth }
        });

        // Get pending action items count
        const pendingActionItems = await MeetingNotes.aggregate([
            { $match: { mentorID } },
            { $unwind: "$actionItems" },
            { $match: { "actionItems.status": { $in: ["Pending", "In Progress"] } } },
            { $count: "pendingCount" }
        ]);

        // Get active mentees count
        const mentor = await Mentor.findOne({ mentorID }).select('menteeIDs');
        const activeMentees = mentor ? mentor.menteeIDs.length : 0;

        res.json({
            success: true,
            stats: {
                totalMeetings,
                meetingsThisMonth,
                pendingActionItems: pendingActionItems[0]?.pendingCount || 0,
                activeMentees
            }
        });
    } catch (error) {
        console.error("❌ Error fetching meeting stats:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

// ✅ Development Helper: Assign mentees to mentor (for testing)
app.post("/api/mentor/assign-mentees", async (req, res) => {
    try {
        const { mentorID, menteeUSNs } = req.body;
        
        if (!mentorID || !menteeUSNs || !Array.isArray(menteeUSNs)) {
            return res.status(400).json({ 
                success: false, 
                message: "MentorID and menteeUSNs array are required" 
            });
        }

        // Find mentor
        const mentor = await Mentor.findOne({ mentorID });
        if (!mentor) {
            return res.status(404).json({ success: false, message: "Mentor not found" });
        }

        // Verify students exist
        const students = await Student.find({ usn: { $in: menteeUSNs } });
        const foundUSNs = students.map(s => s.usn);
        const notFoundUSNs = menteeUSNs.filter(usn => !foundUSNs.includes(usn));
        
        if (notFoundUSNs.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Students not found: ${notFoundUSNs.join(', ')}` 
            });
        }

        // Update mentor's menteeIDs
        mentor.menteeIDs = [...new Set([...mentor.menteeIDs, ...menteeUSNs])]; // Avoid duplicates
        await mentor.save();

        res.json({ 
            success: true, 
            message: `${menteeUSNs.length} students assigned to mentor ${mentorID}`,
            mentor: {
                mentorID: mentor.mentorID,
                fullName: mentor.fullName,
                menteeIDs: mentor.menteeIDs
            }
        });
    } catch (error) {
        console.error("❌ Error assigning mentees:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

/* -----------------------------------
   ✅ Existing Student APIs
-------------------------------------*/
// ✅ Register API for Students
app.post("/api/register", async (req, res) => {
    try {
        const { fullName, usn, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ usn });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({ fullName, usn, email, password });
        await newUser.save();

        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Student Login API (Fixed with token)
app.post("/api/student/login", async (req, res) => {
    try {
        const { usn, password } = req.body;

        // Find student by USN
        const student = await User.findOne({ usn });

        if (!student || student.password !== password) {
            return res.status(400).json({ success: false, message: "Invalid USN or Password" });
        }

        // Get student profile data to return name
        const studentProfile = await Student.findOne({ usn });

        // Generate a simple token (in production you would use JWT)
        const token = Buffer.from(`${usn}-${Date.now()}`).toString('base64');
        
        res.json({ 
            success: true, 
            message: "Login successful",
            token: token,
            usn: usn,
            userId: student._id.toString(),
            studentId: student._id.toString(),
            name: studentProfile?.name || student.fullName || "Student"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

// ✅ Store Student Data API
app.post("/api/students", async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ message: "Student data saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving student data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Fetch Student Profile API (Fixed)
app.get("/api/students/:usn", async (req, res) => {
    try {
        const { usn } = req.params;
        const student = await Student.findOne({ usn });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        console.error("Error fetching student data:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Update Student Profile API
app.put("/api/students/:usn", async (req, res) => {
    try {
        const { usn } = req.params;
        console.log("Updating student data for USN:", usn);
        console.log("Update Data:", req.body);

        const updatedStudent = await Student.findOneAndUpdate(
            { usn },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student data updated successfully!", student: updatedStudent });
    } catch (error) {
        console.error("❌ Error updating student data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Agentic AI Routes (Simplified - No Auto-Scheduler)
try {
    const agentRoutes = require('../../../routes/agentRoutesSimple');
    app.use('/api/agents', agentRoutes);
    console.log('✅ Agentic AI routes loaded');
    console.log('   📚 Manual trigger available: POST /api/agents/run');
    console.log('   📋 Today tasks: GET /api/agents/:userId/today');
    console.log('   � Risk profile: GET /api/agents/:userId/risk-profile');
} catch (err) {
    console.warn('⚠️  Agentic AI routes not available:', err.message);
}

// ✅ Semester-based Academics Routes
try {
    const academicsRoutes = require('../../../routes/academicsRoutes');
    app.use('/api', academicsRoutes);
    console.log('✅ Semester Academics routes loaded');
} catch (err) {
    console.warn('⚠️  Semester Academics routes not available:', err.message);
}

// ✅ Internal Marks Routes
try {
    const internalMarksRoutes = require('../../../routes/internalMarksRoutes');
    app.use('/api', internalMarksRoutes);
    console.log('✅ Internal Marks routes loaded');
} catch (err) {
    console.warn('⚠️  Internal Marks routes not available:', err.message);
}

// ✅ Mentor Verification Routes
try {
    const mentorVerificationRoutes = require('../../../routes/mentorVerificationRoutes');
    app.use('/api', mentorVerificationRoutes);
    console.log('✅ Mentor Verification routes loaded');
} catch (err) {
    console.warn('⚠️  Mentor Verification routes not available:', err.message);
}

// ✅ Notification Routes
try {
    const notificationRoutes = require('../../../routes/notificationRoutes');
    app.use('/api/notifications', notificationRoutes);
    console.log('✅ Notification routes loaded');
} catch (err) {
    console.warn('⚠️  Notification routes not available:', err.message);
}

// ✅ Start Notification Scheduler
try {
    const notificationScheduler = require('../../../services/notificationScheduler');
    notificationScheduler.startAll();
} catch (err) {
    console.warn('⚠️  Notification scheduler not available:', err.message);
}

// ✅ Admin Routes (RBAC Protected)
try {
    const adminRoutes = require('../../../routes/adminRoutes');
    app.use('/api/admin', adminRoutes);
    console.log('✅ Admin routes loaded');
    console.log('   📊 Admin panel endpoints available');
    console.log('   🔐 RBAC protection enabled');
} catch (err) {
    console.warn('⚠️  Admin routes not available:', err.message);
}

// ✅ Start Server on PORT 5002
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
