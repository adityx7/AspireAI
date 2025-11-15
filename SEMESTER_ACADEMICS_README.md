# Semester-Wise Academic System - Quick Start

## 🚀 New Feature: Semester-Based Academic Records

AspireAI now supports semester-wise academic record management with the following capabilities:

### ✨ Key Features

- **Individual Semester Documents**: Each semester (1-8) stored separately for better organization
- **Real-time SGPA/CGPA Calculation**: Automatic grade point computation
- **Inline Editing**: Edit marks directly in the table with live validation
- **Export to PDF**: Print semester reports with one click
- **Migration Support**: Safely migrate from combined to semester-wise structure
- **Feature Flag Control**: Enable/disable via environment variable

---

## 📋 Prerequisites

- Node.js v14+
- MongoDB running on localhost:27017 or remote
- All dependencies installed (`npm install`)

---

## ⚡ Quick Start

### 1. Enable the Feature

Add to your `.env` file:

```bash
USE_SEMESTER_ACADEMICS=true
MONGODB_URI=mongodb://localhost:27017/aspireai
PORT=5002
```

### 2. Install Dependencies (if needed)

```bash
npm install mongoose ajv ajv-formats framer-motion
```

### 3. Start the Server

The semester academics routes will auto-load when you start the server:

```bash
npm run start
# or
node src/components/pages/student/Server.js
```

You should see:
```
✅ Semester Academics routes loaded
🚀 Server running on port 5002
```

### 4. (Optional) Run Migration

If you have existing academic data to migrate:

```bash
# Dry run first (no changes)
node scripts/migrate_academics_to_semesters.js --dry

# Apply migration
node scripts/migrate_academics_to_semesters.js --apply
```

### 5. Use in Frontend

Import and use the AcademicsOverview component:

```jsx
import AcademicsOverview from './components/pages/StudentDashboard/AcademicsOverview';

// In your dashboard
<AcademicsOverview userId={currentUser.id} />
```

---

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students/:id/academics` | Get all semesters with CGPA |
| GET | `/api/students/:id/academics/:semester` | Get specific semester |
| POST | `/api/students/:id/academics/:semester` | Create/update semester |
| PUT | `/api/students/:id/academics/:semester/courses/:courseId` | Update course |
| POST | `/api/students/:id/academics/:semester/courses` | Add new course |
| DELETE | `/api/students/:id/academics/:semester/courses/:courseId` | Delete course |
| DELETE | `/api/students/:id/academics/:semester` | Delete semester |
| GET | `/api/students/:id/academics/:semester/export` | Export as HTML/PDF |

---

## 📖 Example API Request

### Create Semester 1

```bash
curl -X POST http://localhost:5002/api/students/USER123/academics/1 \
  -H "Content-Type: application/json" \
  -d '{
    "academicYear": "2024-2025",
    "courses": [
      {
        "slNo": 1,
        "courseCode": "CS101",
        "courseName": "Computer Science",
        "credits": 4,
        "ia1": 85,
        "ia2": 90,
        "ia3": 88,
        "labMarks": 92,
        "otherMarks": 88,
        "externalMarks": 85,
        "attendancePercent": 90
      }
    ]
  }'
```

### Response

```json
{
  "success": true,
  "message": "Semester data saved successfully",
  "data": {
    "userId": "USER123",
    "semester": 1,
    "academicYear": "2024-2025",
    "courses": [...],
    "sgpa": 8.93,
    "createdAt": "2025-11-15T...",
    "updatedAt": "2025-11-15T..."
  }
}
```

---

## 🧪 Testing

Run the test suite:

```bash
npm test src/__tests__/academicsService.test.js
```

Manual testing with Postman:
- Import `postman_collection.json`
- Use the "Semester Academics" folder

---

## 📁 File Structure

```
AspireAI/
├── src/
│   ├── models/
│   │   └── AcademicSemester.js          # MongoDB schema
│   ├── schemas/
│   │   └── academicSemester.json        # AJV validation
│   ├── services/
│   │   └── academicsService.js          # Business logic
│   ├── routes/
│   │   └── academicsRoutes.js           # API endpoints
│   ├── components/pages/StudentDashboard/
│   │   ├── AcademicsOverview.jsx        # Semester cards view
│   │   └── SemesterPage.jsx             # Individual semester editor
│   └── __tests__/
│       └── academicsService.test.js     # Unit tests
├── scripts/
│   └── migrate_academics_to_semesters.js # Migration script
├── SEMESTER_ACADEMICS_GUIDE.md           # Comprehensive guide
└── postman_collection.json               # Updated with new endpoints
```

---

## 🔧 Configuration Options

### Environment Variables

```bash
# Required
USE_SEMESTER_ACADEMICS=true    # Enable feature
MONGODB_URI=mongodb://...       # Database connection

# Optional
PORT=5002                       # Server port
NODE_ENV=development            # Environment
```

### Grade Calculation Settings

Modify in `src/models/AcademicSemester.js`:

```javascript
// Current formula:
avgIA = (best2IAs) / 2
totalInternal = avgIA * 0.4 + lab * 0.3 + other * 0.3
```

---

## 🐛 Troubleshooting

### Issue: "Feature not enabled" (503 error)

**Solution**: 
```bash
# Add to .env
USE_SEMESTER_ACADEMICS=true

# Restart server
npm run start
```

### Issue: SGPA not calculating

**Solution**: Ensure all courses have:
- Valid `credits` (0-5)
- Valid `gradePoints` (0-10)
- Data saved successfully

### Issue: Migration fails

**Solution**:
1. Run dry-run first: `node scripts/migrate_academics_to_semesters.js --dry`
2. Check MongoDB connection
3. Review error logs
4. Fix data validation issues

### Issue: Frontend not showing data

**Solution**:
1. Check browser console for errors
2. Verify API responses in Network tab
3. Ensure `userId` prop is correct
4. Check backend logs

---

## 📊 Database Schema

### Collection: `academicsemesters`

Each document represents one semester for one student:

```javascript
{
  userId: "USER123",
  semester: 1,              // 1-8
  academicYear: "2024-2025",
  mentorId: "MENTOR1",
  courses: [
    {
      slNo: 1,
      courseCode: "CS101",
      courseName: "Computer Science",
      attendancePercent: 90,
      ia1: 85, ia2: 90, ia3: 88,
      labMarks: 92,
      otherMarks: 88,
      totalInternal: 89,      // Auto-computed
      externalMarks: 85,
      total: 174,             // Auto-computed
      letterGrade: "A",       // Auto-computed
      gradePoints: 9,         // Auto-computed
      credits: 4
    }
  ],
  sgpa: 8.93,              // Auto-computed
  createdAt: ISODate(...),
  updatedAt: ISODate(...)
}
```

**Indexes:**
- `{ userId: 1, semester: 1 }` - Unique constraint
- `{ userId: 1 }` - For fetching all user semesters

---

## 📖 Complete Documentation

For detailed information, see:
- **[SEMESTER_ACADEMICS_GUIDE.md](./SEMESTER_ACADEMICS_GUIDE.md)** - Complete implementation guide
- **[Postman Collection](./postman_collection.json)** - API examples
- **[Migration Script](./scripts/migrate_academics_to_semesters.js)** - Data migration

---

## 🎯 Roadmap

### Completed ✅
- [x] Database schema and models
- [x] CRUD API endpoints
- [x] SGPA/CGPA computation
- [x] Frontend components
- [x] Migration script
- [x] Export to PDF
- [x] Unit tests
- [x] Documentation

### Future Enhancements 🚧
- [ ] Bulk import from CSV/Excel
- [ ] Grade history and trends
- [ ] Comparison with class average
- [ ] Predictive CGPA calculator
- [ ] Mobile app integration
- [ ] Email reports to mentors
- [ ] Transcript generation

---

## 🤝 Contributing

When contributing to semester academics:

1. Follow existing code structure
2. Add tests for new features
3. Update documentation
4. Test migration thoroughly
5. Maintain backward compatibility

---

## 📝 License

Same as AspireAI project license.

---

## 🆘 Support

For issues or questions:
- Check [SEMESTER_ACADEMICS_GUIDE.md](./SEMESTER_ACADEMICS_GUIDE.md)
- Review API responses and backend logs
- Open an issue on GitHub (if applicable)
- Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: November 15, 2025  
**Author**: AspireAI Development Team
