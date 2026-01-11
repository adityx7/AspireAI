/**
 * Script to add sample syllabus data in the new format
 * Run with: node scripts/add_sample_syllabus.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mentorship_platform';

// Define schema inline (to avoid import issues)
const syllabusSchema = new mongoose.Schema({
  batch: { type: String, required: true, trim: true },
  branch: { type: String, required: true, trim: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  courseCode: { type: String, required: true, trim: true, uppercase: true },
  courseName: { type: String, required: true, trim: true },
  module_1_topics: { type: String, default: '' },
  module_2_topics: { type: String, default: '' },
  module_3_topics: { type: String, default: '' },
  module_4_topics: { type: String, default: '' },
  module_5_topics: { type: String, default: '' },
  department: { type: String, trim: true },
  fileName: { type: String },
  pdfPath: { type: String },
  uploadedBy: { type: String },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Syllabus = mongoose.model('Syllabus', syllabusSchema);

// Sample syllabus data based on the screenshot
const sampleSyllabi = [
  {
    batch: '2022',
    branch: 'AIML',
    semester: 3,
    courseCode: '22AI132',
    courseName: 'Fourier Series & Fourier Transforms',
    module_1_topics: 'Fourier Series, Periodic Functions, Dirichlet Conditions, Euler Formulas, Half Range Expansions',
    module_2_topics: 'Fourier Transforms, Fourier Integral, Sine and Cosine Transforms, Properties of Fourier Transforms',
    module_3_topics: 'Laplace Transforms, Properties, Inverse Laplace Transform, Convolution Theorem',
    module_4_topics: 'Z-Transforms, Properties of Z-Transform, Inverse Z-Transform, Solution of Difference Equations',
    module_5_topics: 'Applications of Transforms, Signal Processing, System Analysis, Practical Applications'
  },
  {
    batch: '2022',
    branch: 'AIML',
    semester: 3,
    courseCode: '22AI133',
    courseName: 'Fundamentals of Logic and Relations',
    module_1_topics: 'Propositional Logic, Truth Tables, Logical Connectives, Tautologies, Contradictions',
    module_2_topics: 'Rules of Inference, Predicate Logic, Quantifiers, Proof Techniques, Mathematical Induction',
    module_3_topics: 'Relations, Types of Relations, Equivalence Relations, Partial Ordering, Hasse Diagrams',
    module_4_topics: 'Functions, Types of Functions, Composition, Inverse Functions, Recursively Defined Functions',
    module_5_topics: 'Graph Theory Basics, Trees, Boolean Algebra, Applications in Computer Science'
  },
  {
    batch: '2022',
    branch: 'AIML',
    semester: 3,
    courseCode: '22AI134',
    courseName: 'Vector Spaces',
    module_1_topics: 'Vector Spaces, Subspaces, Linear Combinations, Spanning Sets, Linear Independence',
    module_2_topics: 'Basis and Dimension, Change of Basis, Row Space, Column Space, Null Space',
    module_3_topics: 'Homogeneous Equations and Solutions, Inner Product Spaces, Orthogonality, Gram-Schmidt Process',
    module_4_topics: 'Linear Transformations, Kernel and Range, Matrix Representations, Eigenvalues and Eigenvectors',
    module_5_topics: 'Diagonalization, Applications of Linear Algebra, Singular Value Decomposition, PCA Basics'
  },
  {
    batch: '2022',
    branch: 'AIML',
    semester: 3,
    courseCode: '22AI135',
    courseName: 'Data Structures and Algorithms',
    module_1_topics: 'Introduction to Data Structures, Arrays, Linked Lists, Stacks, Queues, Complexity Analysis',
    module_2_topics: 'Trees, Binary Trees, Binary Search Trees, Tree Traversals, AVL Trees, Heaps',
    module_3_topics: 'Graphs, Graph Representations, BFS, DFS, Shortest Path Algorithms, Minimum Spanning Trees',
    module_4_topics: 'Sorting Algorithms, Searching Algorithms, Hashing, Hash Tables, Collision Resolution',
    module_5_topics: 'Dynamic Programming, Greedy Algorithms, Divide and Conquer, Algorithm Design Techniques'
  },
  {
    batch: '2022',
    branch: 'AIML',
    semester: 3,
    courseCode: '22AI136',
    courseName: 'Computer Organization',
    module_1_topics: 'Basic Computer Organization, CPU Structure, Instruction Formats, Addressing Modes',
    module_2_topics: 'Control Unit Design, Microprogramming, Hardwired Control, Instruction Pipelining',
    module_3_topics: 'Memory Organization, Cache Memory, Virtual Memory, Memory Management',
    module_4_topics: 'Input/Output Organization, I/O Interfaces, DMA, Interrupts, I/O Processors',
    module_5_topics: 'Parallel Processing, Multiprocessors, RISC vs CISC, Modern Processor Architectures'
  }
];

async function addSampleData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if old format data exists and inform user
    const oldFormatCount = await Syllabus.countDocuments({ modules: { $exists: true } });
    if (oldFormatCount > 0) {
      console.log(`⚠️  Found ${oldFormatCount} documents with old format (modules array). These won't be used by the new system.`);
      console.log('   You may want to delete them manually if not needed.');
    }

    // Add sample data
    for (const syllabus of sampleSyllabi) {
      try {
        const result = await Syllabus.findOneAndUpdate(
          { 
            batch: syllabus.batch, 
            branch: syllabus.branch, 
            semester: syllabus.semester, 
            courseCode: syllabus.courseCode 
          },
          { 
            ...syllabus,
            department: syllabus.branch,
            uploadedBy: 'system',
            uploadedAt: new Date()
          },
          { upsert: true, new: true }
        );
        console.log(`✅ Added/Updated: ${result.courseCode} - ${result.courseName}`);
      } catch (err) {
        console.error(`❌ Error adding ${syllabus.courseCode}:`, err.message);
      }
    }

    // Verify data
    const count = await Syllabus.countDocuments({ 
      batch: '2022', 
      branch: 'AIML', 
      semester: 3,
      module_1_topics: { $exists: true, $ne: '' }
    });
    console.log(`\n📚 Total syllabus records for 2022/AIML/Semester 3: ${count}`);

    // List all courses
    const courses = await Syllabus.find({ 
      batch: '2022', 
      branch: 'AIML', 
      semester: 3 
    }).select('courseCode courseName');
    
    console.log('\n📋 Courses added:');
    courses.forEach(c => console.log(`   - ${c.courseCode}: ${c.courseName}`));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

addSampleData();
