// Test script to verify API endpoints
// Run this in browser console or use with a testing tool

const API_BASE = 'http://localhost:5002/api';

// Test data
const testUSN = 'test123';
const testSemesterData = {
    usn: testUSN,
    semesterNumber: 1,
    cgpa: 8.5,
    semesterCourses: [
        {
            name: 'Data Structures',
            grade: 'A',
            credits: 4,
            performanceGraphData: [
                { assessment: 'Quiz 1', marks: 18, maxMarks: 20, date: new Date() },
                { assessment: 'Midterm', marks: 38, maxMarks: 40, date: new Date() }
            ]
        },
        {
            name: 'Database Management',
            grade: 'A+',
            credits: 3,
            performanceGraphData: [
                { assessment: 'Assignment 1', marks: 19, maxMarks: 20, date: new Date() }
            ]
        }
    ],
    reflectionJournal: {
        whatDidWell: 'Good understanding of algorithms and data structures',
        whatToImprove: 'Need to practice more coding problems',
        goals: 'Master advanced data structures',
        challenges: 'Time management during exams'
    }
};

// Test Functions
async function testAddSemester() {
    try {
        console.log('Testing Add Semester API...');
        const response = await fetch(`${API_BASE}/academics/semester`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testSemesterData)
        });
        
        const result = await response.json();
        console.log('Add Semester Result:', result);
        return result;
    } catch (error) {
        console.error('Add Semester Error:', error);
    }
}

async function testGetDashboard() {
    try {
        console.log('Testing Get Dashboard API...');
        const response = await fetch(`${API_BASE}/academics/dashboard/${testUSN}`);
        const result = await response.json();
        console.log('Dashboard Result:', result);
        return result;
    } catch (error) {
        console.error('Dashboard Error:', error);
    }
}

async function testAddAttendance() {
    try {
        console.log('Testing Add Attendance API...');
        const attendanceData = {
            usn: testUSN,
            subjectName: 'Data Structures',
            attendedClasses: 18,
            totalClasses: 20,
            semester: 1
        };
        
        const response = await fetch(`${API_BASE}/academics/attendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(attendanceData)
        });
        
        const result = await response.json();
        console.log('Attendance Result:', result);
        return result;
    } catch (error) {
        console.error('Attendance Error:', error);
    }
}

async function testAddCertification() {
    try {
        console.log('Testing Add Certification API...');
        const certificationData = {
            usn: testUSN,
            name: 'AWS Cloud Practitioner',
            issuer: 'Amazon Web Services',
            date: new Date(),
            domainTags: ['Cloud Computing', 'AWS'],
            verificationLink: 'https://aws.amazon.com/certification/verify'
        };
        
        const response = await fetch(`${API_BASE}/academics/certification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(certificationData)
        });
        
        const result = await response.json();
        console.log('Certification Result:', result);
        return result;
    } catch (error) {
        console.error('Certification Error:', error);
    }
}

// Run all tests
async function runAllTests() {
    console.log('🧪 Starting API Tests...\n');
    
    await testAddSemester();
    console.log('\n');
    
    await testAddAttendance();
    console.log('\n');
    
    await testAddCertification();
    console.log('\n');
    
    await testGetDashboard();
    console.log('\n');
    
    console.log('✅ All tests completed!');
}

// Uncomment the line below to run tests
// runAllTests();

console.log('📋 Academic API Test Script Loaded!');
console.log('Run runAllTests() to execute all API tests');