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

// ✅ Mentor Schema
const mentorSchema = new mongoose.Schema({
    fullName: String,
    mentorID: String,
    email: String,
    password: String,
});
const Mentor = mongoose.model("Mentor", mentorSchema);

// ✅ Student Schema
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
   ✅ Student APIs
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

// ✅ Student Login API (Fixed)
app.post("/api/student/login", async (req, res) => {
    try {
        const { usn, password } = req.body;

        // Find student by USN
        const student = await User.findOne({ usn });

        if (!student || student.password !== password) {
            return res.status(400).json({ success: false, message: "Invalid USN or Password" });
        }

        res.json({ success: true, message: "Login successful" });
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
        const updateData = req.body;

        console.log("Updating student with USN:", usn);
        console.log("Update data:", updateData);

        const updatedStudent = await Student.findOneAndUpdate(
            { usn },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ 
            message: "Student profile updated successfully", 
            student: updatedStudent 
        });
    } catch (error) {
        console.error("Error updating student data:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Start Server on PORT 5002
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
