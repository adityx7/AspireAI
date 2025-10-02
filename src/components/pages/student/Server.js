const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5002; // ✅ Using port 5002

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

// ✅ Student Schema (Updated for Phase 1)
const studentSchema = new mongoose.Schema({
    name: String,   // ✅ Name should match ProfilePage
    usn: String,
    mobileNumber: String,
    alternateMobileNumber: String,
    email: String,
    collegeEmail: String,
    gender: String,
    dob: String,
    graduationYear: String,
    employeeId: String, // ✅ Match frontend `employeeId`
    selectedMajors: [],
    shortBio: String,
    
    // ✅ Phase 1: New fields for advanced features
    academics: {
        semesters: [{
            semesterNumber: { type: Number, required: true },
            cgpa: { type: Number, min: 0, max: 10 },
            semesterCourses: [{
                name: { type: String, required: true },
                grade: { type: String },
                credits: { type: Number, min: 0 },
                performanceGraphData: [{
                    assessment: String, // e.g., "Quiz 1", "Midterm", "Final"
                    marks: Number,
                    maxMarks: Number,
                    date: Date
                }]
            }],
            reflectionJournal: {
                whatDidWell: String,
                whatToImprove: String,
                goals: String,
                challenges: String,
                reflectionDate: { type: Date, default: Date.now }
            }
        }],
        overallCGPA: { type: Number, min: 0, max: 10 },
        totalCredits: { type: Number, default: 0 }
    },
    
    certifications: [{
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        date: { type: Date, required: true },
        domainTags: [String], // e.g., ["Web Development", "Cloud Computing"]
        verificationLink: String,
        certificateImage: String // Optional: base64 or file path
    }],
    
    aictActivityPoints: {
        currentPoints: { type: Number, default: 0 },
        targetPoints: { type: Number, default: 100 },
        activities: [{
            name: { type: String, required: true },
            type: { 
                type: String, 
                enum: ['Academic', 'Extracurricular', 'Project', 'Certification', 'Event'], 
                required: true 
            },
            points: { type: Number, required: true },
            status: { 
                type: String, 
                enum: ['Completed', 'In Progress', 'Planned'], 
                default: 'Planned' 
            },
            dateCompleted: Date,
            description: String
        }]
    },
    
    attendance: [{
        subjectName: { type: String, required: true },
        attendedClasses: { type: Number, default: 0 },
        totalClasses: { type: Number, default: 0 },
        semester: Number,
        attendancePercentage: { type: Number, min: 0, max: 100 }
    }],
    
    // ✅ SWOT Analysis and Career Planning
    swotAnalysis: {
        strengths: [String],
        weaknesses: [String],
        opportunities: [String],
        threats: [String],
        lastUpdated: { type: Date, default: Date.now }
    },
    
    careerInterests: [{
        field: String, // e.g., "Software Development", "Data Science"
        interestLevel: { type: Number, min: 1, max: 10 },
        skills: [String],
        experience: String
    }],
    
    careerRoadmap: [{
        milestone: { type: String, required: true },
        targetDate: Date,
        status: { 
            type: String, 
            enum: ['Not Started', 'In Progress', 'Completed'], 
            default: 'Not Started' 
        },
        description: String,
        requiredSkills: [String]
    }]
}, { strict: false });

const Student = mongoose.model("Student", studentSchema);

/* -----------------------------------
   ✅ Mentor APIs
-------------------------------------*/
app.post("/api/mentor/register", async (req, res) => {
    try {
        console.log("📩 Mentor Registration Request Received:", req.body);
        const { fullName, mentorID, email, password, phoneNumber, alternatePhoneNumber, gender, tech, employeeIn, selectedMajors, bio } = req.body;

        // Check if mentor exists
        const existingMentor = await Mentor.findOne({ $or: [{ mentorID }, { email }] });
        if (existingMentor) return res.status(400).json({ message: "Mentor ID or Email already registered" });

        // ✅ Store Mentor Authentication Info
        const newMentor = new Mentor({ fullName, mentorID, email, password });
        await newMentor.save();

        // ✅ Store Mentor Profile Details
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
            bio, 
        });
        await newMentorDetails.save();

        res.status(201).json({ success: true, message: "Mentor Registered Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
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

app.post("/api/mentors/:mentorID", async (req, res) => {
    try {
        const { mentorID } = req.params;
        console.log("📩 Fetching mentor details for:", mentorID); // ✅ Log request

        const mentorDetails = await MentorDetails.findOne({ mentorID });
        console.log("🎯 Mentor Details Found:", mentorDetails); // ✅ Log fetched data

        if (!mentorDetails) {
            return res.status(404).json({ message: "Mentor profile not found" });
        }

        res.json(mentorDetails);
    } catch (error) {
        console.error("❌ Error fetching mentor details:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.post("/api/mentor/login", async (req, res) => {
    try {
        const { mentorID, password } = req.body;

        if (!mentorID || !password) {
            return res.status(400).json({ success: false, message: "Missing mentorID or password" });
        }

        const mentor = await Mentor.findOne({ mentorID: String(mentorID) });

        if (!mentor || mentor.password !== password) {
            return res.status(400).json({ success: false, message: "Invalid mentorID or Password" });
        }

        res.json({ success: true, message: "Login successful", mentorID }); // ✅ Include mentorID in response
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
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
            return res.status(400).json({ message: "Mentor details already exist" });
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
        res.status(500).json({ message: "Server error", error });
    }
});

app.get("/api/mentor/details", async (req, res) => {
    try {
        const mentors = await MentorDetails.find({}, "fullName selectedMajors bio tech");
        res.json(mentors);
    } catch (error) {
        console.error("❌ Error fetching mentors:", error);
        res.status(500).json({ message: "Server error", error });
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

/* -----------------------------------
   ✅ Student APIs (Existing)
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

        // Generate a simple token (in production you would use JWT)
        const token = Buffer.from(`${usn}-${Date.now()}`).toString('base64');
        
        res.json({ 
            success: true, 
            message: "Login successful",
            token: token,
            usn: usn
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

// ✅ Start Server on PORT 5002
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
