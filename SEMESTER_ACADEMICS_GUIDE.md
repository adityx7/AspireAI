# Semester-Wise Academic System Guide

## Overview

This guide covers the implementation of the semester-wise academic records system in AspireAI. The system replaces the previous combined academic structure with individual semester documents for better organization and scalability.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Migration Guide](#migration-guide)
3. [API Reference](#api-reference)
4. [Frontend Components](#frontend-components)
5. [Database Schema](#database-schema)
6. [Configuration](#configuration)
7. [Testing](#testing)

---

## System Architecture

### Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────────┐      ┌────────────────────────┐  │
│  │ AcademicsOverview│──────▶│   SemesterPage         │  │
│  │  (Semester Cards)│      │  (Edit courses/marks)  │  │
│  └──────────────────┘      └────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend API (Express)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │         academicsRoutes.js                        │  │
│  │  GET/POST/PUT/DELETE /api/students/:id/academics │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                Business Logic Layer                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │         academicsService.js                       │  │
│  │  - computeSemesterSGPA()                         │  │
│  │  - recomputeCGPA()                               │  │
│  │  - validateSemesterData()                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Database                        │
│  ┌──────────────────┐      ┌────────────────────────┐  │
│  │ academicsemesters│      │  Migration Logs       │  │
│  │  (One doc per    │      │  Backups              │  │
│  │   user/semester) │      │                        │  │
│  └──────────────────┘      └────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Migration Guide

### Prerequisites

- MongoDB running locally or remotely
- Node.js environment with dependencies installed
- Backup of existing academic records (recommended)

### Migration Steps

#### 1. Prepare Environment

Set the feature flag in your `.env` file:

```bash
# Enable semester-based academics feature
USE_SEMESTER_ACADEMICS=true

# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/aspireai
```

#### 2. Run Dry-Run Migration

Test the migration without making changes:

```bash
node scripts/migrate_academics_to_semesters.js --dry
```

Expected output:
```
============================================================
DRY RUN: Combined → Semester-wise Academics
============================================================

✓ Found old collection: academics_all
✓ Found 15 combined records to migrate

📝 Processing user: USER001
  ✓ Backed up original data
  ✓ Parsed into 4 semester document(s)
  ✓ Would create: Semester 1 with 6 courses
  ✓ Would create: Semester 2 with 7 courses
  ...

============================================================
MIGRATION SUMMARY
============================================================
✓ Successful: 15
✗ Errors: 0

⚠ This was a DRY RUN. No changes were made.
Run with --apply to apply the migration.
```

#### 3. Review and Validate

Check the dry-run output for any errors. Fix data issues in the source collection if needed.

#### 4. Apply Migration

Run the actual migration:

```bash
node scripts/migrate_academics_to_semesters.js --apply
```

This will:
- Create backup documents for rollback
- Parse combined records into semester documents
- Validate each document with AJV schema
- Compute SGPA for each semester
- Log all changes to `migrationlogs` collection

#### 5. Verify Migration

Check the database:

```javascript
// Connect to MongoDB
use aspireai

// Count semester documents
db.academicsemesters.count()

// Sample a few documents
db.academicsemesters.find().limit(5)

// Check migration logs
db.migrationlogs.find({ status: 'error' })
```

#### 6. Rollback (if needed)

If something goes wrong:

```bash
node scripts/migrate_academics_to_semesters.js --rollback
```

This will:
- Delete all semester documents
- Preserve original data from backups
- Log rollback actions

---

## API Reference

### Base URL

```
http://localhost:5002/api/students
```

### Authentication

All endpoints require authentication. Include user credentials in headers or session.

### Endpoints

#### 1. Get All Semesters

**Request:**
```http
GET /students/:id/academics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "semesters": [
      {
        "userId": "USER123",
        "semester": 1,
        "academicYear": "2024-2025",
        "mentorId": "MENTOR1",
        "courses": [
          {
            "slNo": 1,
            "courseCode": "CS101",
            "courseName": "Introduction to Computer Science",
            "attendancePercent": 90,
            "ia1": 85,
            "ia2": 90,
            "ia3": 88,
            "labMarks": 92,
            "otherMarks": 88,
            "totalInternal": 89,
            "externalMarks": 85,
            "total": 174,
            "letterGrade": "A",
            "gradePoints": 9,
            "credits": 4
          }
        ],
        "sgpa": 8.7,
        "createdAt": "2025-11-15T10:30:00.000Z",
        "updatedAt": "2025-11-15T10:30:00.000Z"
      }
    ],
    "cgpa": 8.5,
    "totalSemesters": 2
  }
}
```

#### 2. Get Single Semester

**Request:**
```http
GET /students/:id/academics/:semester
```

**Path Parameters:**
- `id` (string): User ID
- `semester` (integer): Semester number (1-8)

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "USER123",
    "semester": 1,
    "academicYear": "2024-2025",
    "mentorId": "MENTOR1",
    "courses": [...],
    "sgpa": 8.7,
    "createdAt": "2025-11-15T10:30:00.000Z",
    "updatedAt": "2025-11-15T10:30:00.000Z"
  }
}
```

#### 3. Create/Update Semester

**Request:**
```http
POST /students/:id/academics/:semester
Content-Type: application/json

{
  "academicYear": "2024-2025",
  "mentorId": "MENTOR1",
  "courses": [
    {
      "slNo": 1,
      "courseCode": "CS101",
      "courseName": "Introduction to Computer Science",
      "attendancePercent": 90,
      "ia1": 85,
      "ia2": 90,
      "ia3": 88,
      "labMarks": 92,
      "otherMarks": 88,
      "externalMarks": 85,
      "credits": 4
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Semester data saved successfully",
  "data": { /* Updated semester document */ }
}
```

#### 4. Update Single Course

**Request:**
```http
PUT /students/:id/academics/:semester/courses/:courseId
Content-Type: application/json

{
  "ia1": 90,
  "ia2": 92,
  "externalMarks": 88
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": { /* Updated semester document */ }
}
```

#### 5. Delete Course

**Request:**
```http
DELETE /students/:id/academics/:semester/courses/:courseId
```

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": { /* Updated semester document */ }
}
```

#### 6. Add New Course

**Request:**
```http
POST /students/:id/academics/:semester/courses
Content-Type: application/json

{
  "courseCode": "CS102",
  "courseName": "Data Structures",
  "credits": 4,
  "ia1": 0,
  "ia2": 0,
  "ia3": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course added successfully",
  "data": { /* Updated semester document */ }
}
```

#### 7. Export Semester

**Request:**
```http
GET /students/:id/academics/:semester/export?format=html
```

**Query Parameters:**
- `format` (string): `html` or `pdf`

**Response:**
HTML page ready for printing/saving as PDF

---

## Frontend Components

### AcademicsOverview Component

**Location:** `src/components/pages/StudentDashboard/AcademicsOverview.jsx`

**Features:**
- Displays 8 semester cards (1-8)
- Shows SGPA badge for each completed semester
- Displays cumulative CGPA
- Click card to navigate to SemesterPage

**Usage:**
```jsx
import AcademicsOverview from './StudentDashboard/AcademicsOverview';

<AcademicsOverview userId={currentUser.id} />
```

### SemesterPage Component

**Location:** `src/components/pages/StudentDashboard/SemesterPage.jsx`

**Features:**
- Inline editing for course marks
- Real-time validation (0-100 for marks, 0-5 for credits)
- Auto-computation of totals, grades, SGPA
- Add/Remove course rows with animations
- Export to PDF button
- Save changes to backend

**Usage:**
```jsx
import SemesterPage from './StudentDashboard/SemesterPage';

<SemesterPage 
  userId={currentUser.id} 
  semester={1}
  onBack={() => navigate('/academics')}
/>
```

---

## Database Schema

### Collection: `academicsemesters`

```javascript
{
  _id: ObjectId,
  userId: String,              // Required, indexed
  semester: Number,            // Required, 1-8, indexed
  academicYear: String,        // Required, format: "YYYY-YYYY"
  mentorId: String,            // Optional
  courses: [
    {
      slNo: Number,
      courseCode: String,
      courseName: String,
      attendancePercent: Number,  // 0-100
      ia1: Number,                // 0-100
      ia2: Number,                // 0-100
      ia3: Number,                // 0-100
      labMarks: Number,           // 0-100
      otherMarks: Number,         // 0-100
      totalInternal: Number,      // Computed
      externalMarks: Number,      // 0-100
      total: Number,              // Computed
      letterGrade: String,        // S/A/B/C/D/E/F
      gradePoints: Number,        // 0-10
      credits: Number             // 0-5
    }
  ],
  sgpa: Number,                // Computed, 0-10
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ userId: 1, semester: 1 }` - Unique compound index
- `{ userId: 1 }` - For fetching all user semesters

---

## Configuration

### Environment Variables

```bash
# Feature Flag
USE_SEMESTER_ACADEMICS=true

# Database
MONGODB_URI=mongodb://localhost:27017/aspireai

# Server
PORT=5002
NODE_ENV=development
```

### Enable Feature

To enable semester-based academics:

1. Set `USE_SEMESTER_ACADEMICS=true` in `.env`
2. Restart backend server
3. Run migration (if needed)
4. Update frontend routes to use AcademicsOverview

---

## Testing

### Run Unit Tests

```bash
npm test src/__tests__/academicsService.test.js
```

### Manual Testing Checklist

- [ ] Create new semester with courses
- [ ] Edit course marks inline
- [ ] Verify SGPA computation
- [ ] Add new course row
- [ ] Delete course row
- [ ] Export semester to PDF
- [ ] Navigate between semesters
- [ ] Verify CGPA calculation
- [ ] Test validation errors (marks > 100)
- [ ] Test feature flag (disable and check 503 error)

### API Testing with Postman

Import the provided Postman collection (`postman_collection.json`) and run the "Semester Academics" folder.

---

## Troubleshooting

### Common Issues

**1. Feature not enabled (503 error)**
- Solution: Set `USE_SEMESTER_ACADEMICS=true` in `.env` and restart server

**2. Migration fails**
- Solution: Check MongoDB connection, review dry-run output, fix data issues

**3. SGPA not updating**
- Solution: Ensure courses have valid credits and gradePoints

**4. Cannot save semester**
- Solution: Check validation errors in API response, ensure marks are 0-100

**5. Export not working**
- Solution: Check backend logs, ensure semester exists with data

---

## Support

For issues or questions:
- Check migration logs: `db.migrationlogs.find()`
- Review API error responses
- Check backend console for detailed errors
- Verify environment variables are set correctly

---

## Appendix

### Grade Calculation Formula

**Total Internal:**
```
avgBest2IAs = (Best IA1 + Best IA2) / 2
totalInternal = avgBest2IAs * 0.4 + labMarks * 0.3 + otherMarks * 0.3
```

**Letter Grade:**
```
Percentage = (Total / 200) * 100

S: >= 90%  (GP: 10)
A: >= 80%  (GP: 9)
B: >= 70%  (GP: 8)
C: >= 60%  (GP: 7)
D: >= 50%  (GP: 6)
E: >= 40%  (GP: 5)
F: <  40%  (GP: 0)
```

**SGPA:**
```
SGPA = Σ(GradePoints × Credits) / Σ(Credits)
```

**CGPA:**
```
CGPA = Σ(All course GradePoints × Credits across all semesters) / Σ(All Credits)
```

---

## Version History

- **v1.0.0** (2025-11-15): Initial implementation of semester-wise academic system
  - Database schema
  - API endpoints
  - Frontend components
  - Migration script
  - Documentation

---

*End of Guide*
