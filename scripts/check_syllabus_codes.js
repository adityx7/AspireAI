const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mentorship_platform').then(async () => {
  const Syllabus = require('../src/models/Syllabus');
  
  // Get all syllabus records 
  const all = await Syllabus.find({}).lean();
  console.log('Total syllabus records:', all.length);
  
  if (all.length > 0) {
    // Group by branch
    const byBranch = {};
    all.forEach(s => {
      if (!byBranch[s.branch]) byBranch[s.branch] = [];
      byBranch[s.branch].push(s.courseCode + ': ' + s.courseName);
    });
    console.log('\nBranches found:', Object.keys(byBranch));
    
    // Look for courses with 132 in code
    const code132 = all.filter(s => s.courseCode && s.courseCode.includes('132'));
    console.log('\nCourses with code 132:', code132.map(c => c.courseCode + ': ' + c.courseName));
    
    // Look for Computer Organization
    const compOrg = all.filter(s => s.courseName && s.courseName.toLowerCase().includes('computer'));
    console.log('\nComputer-related courses:', compOrg.map(c => c.courseCode + ': ' + c.courseName));
  }
  
  mongoose.disconnect();
}).catch(err => console.error('Error:', err));
