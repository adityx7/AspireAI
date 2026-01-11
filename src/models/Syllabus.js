const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  batch: {
    type: String,
    required: true,
    trim: true
  },
  branch: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  courseCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  module_1_topics: {
    type: String,
    default: ''
  },
  module_2_topics: {
    type: String,
    default: ''
  },
  module_3_topics: {
    type: String,
    default: ''
  },
  module_4_topics: {
    type: String,
    default: ''
  },
  module_5_topics: {
    type: String,
    default: ''
  },
  // Keep legacy fields for backward compatibility
  department: {
    type: String,
    trim: true
  },
  fileName: {
    type: String
  },
  pdfPath: {
    type: String
  },
  uploadedBy: {
    type: String,
    ref: 'Admin'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for unique course per batch/branch/semester
syllabusSchema.index({ batch: 1, branch: 1, semester: 1, courseCode: 1 }, { unique: true });

// Helper method to get modules as array (for backward compatibility)
syllabusSchema.methods.getModulesArray = function() {
  return [
    { moduleNumber: 1, topics: this.module_1_topics },
    { moduleNumber: 2, topics: this.module_2_topics },
    { moduleNumber: 3, topics: this.module_3_topics },
    { moduleNumber: 4, topics: this.module_4_topics },
    { moduleNumber: 5, topics: this.module_5_topics }
  ];
};

module.exports = mongoose.model('Syllabus', syllabusSchema);
