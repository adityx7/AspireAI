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


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
