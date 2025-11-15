# Internal Marks System - Documentation

## Overview
The Internal Marks system is a **separate module** from the Academic/University Examination system. It manages **semester-wise internal assessment marks** including IA1, IA2, IA3, Lab, Other marks, and attendance percentage.

## Key Features

### 1. **Separate from Academics**
- Internal Marks has its own dedicated section in the navigation
- Different database collection (`internalmarks`)
- Focuses only on internal assessments, not final exam results

### 2. **Semester-Wise Structure**
- 8 semester cards overview page
- Each semester has detailed internal marks entry page
- Matches the physical diary format shown in the image

### 3. **Auto-Calculation**
The system automatically calculates the **Total Internal (50 marks)** using the formula:
```
Total Internal = Best 2 of (IA1, IA2, IA3) × 20/30 + Lab × 15/25 + Other × 15/25
```

### 4. **Data Fields**

#### Semester Metadata:
- Academic Year (e.g., 2024-2025)
- Semester Number (1-8)
- Mentor Name
- Fees to be Paid
- Fees Paid
- Receipt Number

#### Course Fields:
- Course Code
- Course Name
- Attendance Percentage (0-100%)
- IA1 (0-15 marks)
- IA2 (0-15 marks)
- IA3 (0-15 marks)
- Lab (0-25 marks)
- Other (0-25 marks)
- **Total Internal (auto-calculated, max 50)**

## Files Created

### Backend:
1. **`src/models/InternalMarks.js`**
   - MongoDB schema with compound index (userId + semester)
   - Pre-save hook for auto-calculation
   - Instance methods for course management

2. **`src/routes/internalMarksRoutes.js`**
   - GET `/api/students/:userId/internal-marks` - Get all semesters
   - GET `/api/students/:userId/internal-marks/:semester` - Get specific semester
   - POST `/api/students/:userId/internal-marks/:semester` - Create/Update semester
   - PUT `/api/students/:userId/internal-marks/:semester/courses/:courseCode` - Update course
   - POST `/api/students/:userId/internal-marks/:semester/courses` - Add course
   - DELETE `/api/students/:userId/internal-marks/:semester/courses/:courseCode` - Delete course
   - DELETE `/api/students/:userId/internal-marks/:semester` - Delete semester

### Frontend:
3. **`src/components/pages/StudentDashboard/InternalMarksOverview.jsx`**
   - Shows 8 semester cards
   - Displays average attendance and course count
   - Color-coded based on attendance (Green: ≥85%, Orange: 75-84%, Red: <75%)

4. **`src/components/pages/StudentDashboard/SemesterInternalMarks.jsx`**
   - Detailed semester page with table layout matching the image
   - Inline editing for all fields
   - Live calculation of total internal marks
   - Add/delete courses functionality
   - Save functionality with validation

### Integration:
5. **`src/App.js`** - Added routes
6. **`src/components/organisms/SideBar.js`** - Added "Internal Marks" menu item
7. **`src/components/pages/student/Server.js`** - Integrated API routes

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students/:userId/internal-marks` | Get all semesters for a student |
| GET | `/api/students/:userId/internal-marks/:semester` | Get specific semester data |
| POST | `/api/students/:userId/internal-marks/:semester` | Create or update semester data |
| PUT | `/api/students/:userId/internal-marks/:semester/courses/:courseCode` | Update a specific course |
| POST | `/api/students/:userId/internal-marks/:semester/courses` | Add a new course |
| DELETE | `/api/students/:userId/internal-marks/:semester/courses/:courseCode` | Delete a course |
| DELETE | `/api/students/:userId/internal-marks/:semester` | Delete entire semester data |

## Usage Flow

### For Students:

1. **Navigate to Internal Marks**
   - Click "Internal Marks" in the sidebar
   - View overview of all 8 semesters

2. **Select a Semester**
   - Click on any semester card
   - Opens detailed internal marks page

3. **Enter/Edit Data**
   - Fill in semester metadata (Academic Year, Mentor, Fees)
   - Click "Add Course" to add courses
   - Enter course code, name, and marks
   - System auto-calculates total internal marks
   - Attendance percentage tracked per course

4. **Save Changes**
   - Click "Save All" button
   - Data is persisted to database

5. **View Progress**
   - Return to overview to see semester completion
   - Color-coded attendance indicators
   - Course count displayed on cards

## Database Schema

```javascript
{
  userId: ObjectId,
  semester: Number (1-8),
  academicYear: String,
  mentorName: String,
  feesToBePaid: Number,
  feesPaid: Number,
  receiptNo: String,
  courses: [
    {
      courseCode: String,
      courseName: String,
      attendancePercentage: Number (0-100),
      ia1: Number (0-15),
      ia2: Number (0-15),
      ia3: Number (0-15),
      lab: Number (0-25),
      other: Number (0-25),
      totalInternal: Number (0-50, auto-calculated)
    }
  ],
  timestamps: true
}
```

## Key Differences from Academics System

| Feature | Internal Marks | Academics (University Results) |
|---------|---------------|-------------------------------|
| Focus | Internal assessments only | Final exam results |
| Fields | IA1, IA2, IA3, Lab, Other | External, Total, Grade, Credits |
| Calculation | Best 2 IAs + Lab + Other | External + Internal = Total |
| Max Marks | 50 (internal) | 100 (total) |
| Navigation | "Internal Marks" menu | "Academics" menu |
| Collection | `internalmarks` | `academicsemesters` |

## Testing

1. **Access the system:**
   - Login to student dashboard
   - Click "Internal Marks" in sidebar

2. **Test semester creation:**
   - Click on "Semester 1" card
   - Fill in academic year and mentor name
   - Click "Add Course"
   - Enter sample data
   - Verify auto-calculation works
   - Click "Save All"

3. **Verify data persistence:**
   - Navigate back to overview
   - Re-open the semester
   - Confirm data is saved

## Server Status

✅ **Backend Server**: Running on port 5002  
✅ **Internal Marks Routes**: Loaded successfully  
✅ **MongoDB**: Connected  
✅ **React Frontend**: Running on port 3000

## Next Steps

1. Reload the page in Chrome (http://localhost:3000)
2. Login to your student account
3. Look for "Internal Marks" in the sidebar menu
4. Click to access the new internal marks system
5. Start entering your semester-wise internal marks!

## Notes

- The system uses the same calculation formula as shown in your image
- All validations are in place (max marks limits)
- Data is automatically saved to MongoDB
- The layout closely matches the physical diary format
- Completely separate from the university examination/academics module

---

**Created:** November 15, 2025  
**Status:** ✅ Fully Implemented and Ready to Use
