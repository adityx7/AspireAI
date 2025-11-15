# Semester Marks Entry Page

## Overview
The **Semester Marks Page** is a dedicated data-entry interface that matches the physical Mentor Diary layout. It provides a single comprehensive table per semester with all academic fields including internal assessments and external examination marks.

## Features

### 🎯 Complete Marks Entry
- **One page per semester** (1-8) with full marks table
- **All columns included**:
  - Sl. No., Course Code, Course Name
  - Attendance Percentage
  - IA1, IA2, IA3 (max 15 each)
  - Lab, Other (max 25 each)
  - Total Internal (auto-calculated, max 50)
  - External (max 50)
  - Total (auto-calculated, max 100)
  - Letter Grade (auto-assigned)
  - Grade Points (auto-assigned)
  - Credits

### 🔢 Auto-Calculations
- **Total Internal**: Best 2 of (IA1, IA2, IA3) × 20/30 + Lab × 15/25 + Other × 15/25
- **Total Marks**: Internal + External
- **Letter Grade & Points**: Based on total marks (S=10, A=9, B=8, C=7, D=6, E=5, F=0)
- **SGPA**: Σ(Credits × Grade Points) / Σ(Credits)

### ✏️ Inline Editing
- All fields are directly editable in the table
- Client-side validation (marks 0-100, attendance 0-100, etc.)
- Live updates of calculated fields as you type
- Add/remove course rows dynamically

### 🎨 User Experience
- **Indigo + Gold theme** matching AspireAI design
- **Framer Motion animations** for row add/remove
- **Semester navigation**: Prev/Next buttons + dropdown selector
- **Export to PDF**: One-click semester report generation
- **Toast notifications**: Success/error feedback
- **Responsive design**: Works on desktop and tablet

## How to Access

### Via Sidebar Menu:
1. Login to student dashboard
2. Click **"Semester Marks"** in the sidebar (below "Academics")
3. Defaults to Semester 1
4. Use navigation to switch between semesters

### Direct URL:
```
http://localhost:3000/semester-marks/1  (Semester 1)
http://localhost:3000/semester-marks/2  (Semester 2)
...
http://localhost:3000/semester-marks/8  (Semester 8)
```

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/students/:id/academics/:semester` | Fetch semester data |
| PUT | `/api/students/:id/academics/:semester` | Save semester data (triggers SGPA/CGPA calculation) |
| GET | `/api/students/:id/academics/:semester/export` | Export semester as PDF |

## Workflow

### 1. Initial Load
- Page fetches existing semester data from database
- If no data exists, shows empty table

### 2. Data Entry
- Click "Add Course" to add rows
- Fill in course details and marks
- System auto-calculates:
  - Total Internal marks
  - Total marks
  - Letter grade
  - Grade points
- Watch SGPA update in real-time

### 3. Validation
- Marks must be within allowed ranges
- Required fields: Course Code, Course Name
- Invalid entries are highlighted

### 4. Saving
- Click "Save All" button
- Backend computes and stores SGPA for this semester
- Triggers `recomputeCGPA(userId)` to update overall CGPA
- Shows success toast notification

### 5. PDF Export
- Click "Export PDF" button
- Generates downloadable PDF report
- Filename: `Semester_X_Marks.pdf`

## File Structure

```
src/
├── components/pages/StudentDashboard/
│   └── SemesterMarksPage.jsx          # Main component (752 lines)
├── utils/
│   └── semesterMarksHelpers.js        # Helper functions
├── __tests__/
│   └── semesterMarksHelpers.test.js   # Unit + integration tests
└── routes/
    └── academicsRoutes.js             # Backend API (updated)
```

## Key Functions

### Frontend (`SemesterMarksPage.jsx`)
```javascript
computeGrade(total)              // Returns {letter, points}
computeSemesterSGPA(courses)     // Calculates SGPA
handleCourseFieldChange()        // Updates course and triggers calculations
handleSave()                     // Saves to backend with SGPA
handleExportPDF()                // Downloads PDF
```

### Backend (`academicsRoutes.js`)
```javascript
PUT /api/students/:id/academics/:semester
  └─> upsertSemester(userId, semester, data)
      └─> computeSemesterSGPA(courses)
      └─> recomputeCGPA(userId)
```

### Helpers (`semesterMarksHelpers.js`)
```javascript
computeGrade(total)              // Grade calculation
computeSemesterSGPA(courses)     // SGPA calculation
computeTotalInternal(course)     // Internal marks formula
computeCourseFields(course)      // All computed fields
validateCourse(course)           // Validation
```

## Differences from Other Views

| Feature | Semester Marks Page | Internal Marks | Academics Overview |
|---------|-------------------|----------------|-------------------|
| **Purpose** | Complete data entry | Internal marks only | Visualization |
| **Fields** | All (Internal + External) | Internal only | Summary view |
| **Layout** | Single table | Separate tables | Card-based |
| **Editing** | Inline | Inline | Read-only |
| **Auto-calc** | Yes (all fields) | Yes (internal only) | No |
| **Export** | PDF | No | No |

## Testing

### Run Unit Tests:
```bash
npm test -- semesterMarksHelpers.test.js
```

### Test Coverage:
- ✅ `computeGrade` - All grade ranges
- ✅ `computeSemesterSGPA` - Various scenarios
- ✅ `computeTotalInternal` - Best 2 IAs formula
- ✅ `computeCourseFields` - Complete computation
- ✅ `validateCourse` - Field validation
- ✅ Integration test - Full semester save flow

### Manual Testing:
1. Navigate to Semester Marks page
2. Add 3-4 courses
3. Enter various marks
4. Verify auto-calculations
5. Click Save All
6. Verify SGPA updates
7. Try Export PDF
8. Navigate between semesters

## Data Model

The page uses the existing `AcademicSemester` model with fields:
```javascript
{
  userId: ObjectId,
  semester: Number (1-8),
  academicYear: String,
  sgpa: Number,
  courses: [
    {
      courseCode: String,
      courseName: String,
      attendancePercentage: Number,
      ia1, ia2, ia3: Number (0-15),
      lab, other: Number (0-25),
      totalInternal: Number (0-50),
      external: Number (0-50),
      total: Number (0-100),
      letterGrade: String,
      gradePoints: Number (0-10),
      credits: Number
    }
  ]
}
```

## Grading Scale

| Total Marks | Letter Grade | Grade Points |
|-------------|--------------|--------------|
| 90-100 | S | 10 |
| 80-89 | A | 9 |
| 70-79 | B | 8 |
| 60-69 | C | 7 |
| 50-59 | D | 6 |
| 40-49 | E | 5 |
| 0-39 | F | 0 |

## Notes

### ✅ What This Page DOES:
- Provides easy semester-wise data entry
- Matches physical diary layout exactly
- Auto-calculates all derived fields
- Validates input ranges
- Saves with SGPA/CGPA computation
- Exports to PDF

### ❌ What This Page DOES NOT:
- Replace the Academics overview (dashboard visualization remains)
- Delete existing data (it coexists with combined views)
- Require migration (creates semester docs as needed)
- Show historical trends (use Academics page for that)

### 💡 Best Practices:
- Enter data semester by semester
- Verify auto-calculations before saving
- Use Export PDF for record-keeping
- Check SGPA calculation after each save
- Review validation errors before proceeding

## Troubleshooting

### Page shows empty table:
- Normal for first-time access
- Click "Add Course" to start

### Auto-calculations not updating:
- Check that marks are within valid ranges
- Ensure all numeric fields have values (not empty)

### Save fails:
- Verify Course Code and Name are filled
- Check that marks don't exceed maximums
- Look for validation error messages

### PDF export not working:
- Ensure backend server is running on port 5002
- Check browser console for errors
- Verify export endpoint is accessible

## Future Enhancements (Optional)

- [ ] Bulk import from Excel/CSV
- [ ] Copy marks from previous semester
- [ ] Print preview before PDF export
- [ ] Attendance-based warnings
- [ ] Compare with classmates (anonymous)
- [ ] Progress tracking over semesters

---

**Status**: ✅ Fully Implemented and Ready to Use  
**Version**: 1.0  
**Last Updated**: November 15, 2025
