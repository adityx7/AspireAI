const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5002;
const DATA_FILE = path.join(__dirname, "students.json");

// Middleware
app.use(express.json());
app.use(cors());

// Email validation regex
const emailRegex = /^[0-9]{2}(cse|eee|aiml|ise|me|ece)[0-9]{3}@bnmit\.in$/;

// USN validation regex
const usnRegex = /^1BG\d{2}(CS|IS|AI|ME|EE|EC)\d{3}$/;

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_()#])[A-Za-z\d@$!%*?&]{8,}$/;

// Function to read data from students.json
const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            console.log("No file found, returning empty array.");
            return [];
        }
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading data:", error);
        return [];
    }
};

// Function to write data to students.json
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log("Data successfully written to students.json");
    } catch (error) {
        console.error("Error writing data:", error);
    }
};

// User Registration Route
app.post("/api/register", async (req, res) => {
    try {
        const { fullName, usn, email, password } = req.body;

        // Validate inputs
        if (!fullName || !usn || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!usnRegex.test(usn)) {
            return res.status(400).json({ message: "Invalid USN format" });
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character",
            });
        }

        // Read existing students data
        const students = readData();

        // Check if user already exists
        if (students.some(student => student.email === email)) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add new student
        const newStudent = { fullName, usn, email, password: hashedPassword, decryptedPassword: password };
        students.push(newStudent);

        // Write updated data to file
        writeData(students);

        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get student profile by USN
app.get("/api/students/:usn", (req, res) => {
    try {
        const { usn } = req.params;
        const students = readData();
        
        const student = students.find(s => s.usn === usn.toUpperCase());
        
        if (!student) {
            return res.status(404).json({ message: "Student profile not found" });
        }
        
        // Remove sensitive data before sending
        const { password, decryptedPassword, ...studentData } = student;
        
        res.status(200).json(studentData);
    } catch (error) {
        console.error("Error fetching student profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update student profile by USN
app.put("/api/students/:usn", (req, res) => {
    try {
        const { usn } = req.params;
        const updates = req.body;
        const students = readData();
        
        const studentIndex = students.findIndex(s => s.usn === usn.toUpperCase());
        
        if (studentIndex === -1) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        // Merge updates with existing data, but don't allow password changes through this endpoint
        const { password, decryptedPassword, ...allowedUpdates } = updates;
        students[studentIndex] = { ...students[studentIndex], ...allowedUpdates };
        
        writeData(students);
        
        // Remove sensitive data before sending
        const { password: pwd, decryptedPassword: dpwd, ...studentData } = students[studentIndex];
        
        res.status(200).json({ message: "Profile updated successfully", student: studentData });
    } catch (error) {
        console.error("Error updating student profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Create/Add new student profile
app.post("/api/students", (req, res) => {
    try {
        const newStudent = req.body;
        const students = readData();
        
        // Check if student already exists
        if (students.some(s => s.usn === newStudent.usn.toUpperCase())) {
            return res.status(400).json({ message: "Student profile already exists" });
        }
        
        students.push({ ...newStudent, usn: newStudent.usn.toUpperCase() });
        writeData(students);
        
        res.status(201).json({ message: "Profile created successfully" });
    } catch (error) {
        console.error("Error creating student profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
