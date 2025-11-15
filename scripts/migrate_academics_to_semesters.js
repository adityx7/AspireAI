#!/usr/bin/env node

/**
 * Migration Script: Convert combined academic records to semester-wise documents
 * 
 * Usage:
 *   node scripts/migrate_academics_to_semesters.js --dry      # Dry run (no changes)
 *   node scripts/migrate_academics_to_semesters.js --apply    # Apply migration
 *   node scripts/migrate_academics_to_semesters.js --rollback # Rollback migration
 */

const mongoose = require('mongoose');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
require('dotenv').config();

const AcademicSemester = require('../src/models/AcademicSemester');
const academicSemesterSchema = require('../src/schemas/academicSemester.json');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateSemester = ajv.compile(academicSemesterSchema);

// Migration log schema
const migrationLogSchema = new mongoose.Schema({
  migrationType: String,
  timestamp: { type: Date, default: Date.now },
  userId: String,
  action: String, // 'migrate', 'rollback'
  status: String, // 'success', 'error'
  details: mongoose.Schema.Types.Mixed,
  error: String
});

const MigrationLog = mongoose.model('MigrationLog', migrationLogSchema);

// Backup schema for rollback
const backupSchema = new mongoose.Schema({
  migrationId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now },
  userId: String,
  originalData: mongoose.Schema.Types.Mixed
});

const Backup = mongoose.model('Backup', backupSchema);

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aspireai';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * Find all combined academic records
 * Assuming they're in a collection called 'academics_all' or similar
 */
async function findCombinedRecords() {
  try {
    // Try to find old combined structure
    // This is a placeholder - adjust based on your actual old schema
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const oldCollectionNames = ['academics_all', 'academicsAll', 'student_academics'];
    let oldCollection = null;
    
    for (const name of oldCollectionNames) {
      if (collections.find(c => c.name === name)) {
        oldCollection = db.collection(name);
        console.log(`✓ Found old collection: ${name}`);
        break;
      }
    }
    
    if (!oldCollection) {
      console.log('ℹ No old combined academic records found');
      return [];
    }
    
    const records = await oldCollection.find({}).toArray();
    console.log(`✓ Found ${records.length} combined records to migrate`);
    return records;
  } catch (error) {
    console.error('✗ Error finding combined records:', error);
    return [];
  }
}

/**
 * Parse combined record into semester documents
 */
function parseCombinedToSemesters(combinedRecord) {
  const semesters = [];
  
  // Example parsing logic - adjust based on your actual data structure
  // Assuming combined record has structure like:
  // { userId, semesters: [ { semester: 1, courses: [...] }, ... ] }
  
  if (combinedRecord.semesters && Array.isArray(combinedRecord.semesters)) {
    combinedRecord.semesters.forEach(semData => {
      semesters.push({
        userId: combinedRecord.userId || combinedRecord._id,
        semester: semData.semester || semData.sem || 1,
        academicYear: semData.academicYear || '2024-2025',
        mentorId: combinedRecord.mentorId || null,
        courses: semData.courses || [],
        sgpa: semData.sgpa || 0
      });
    });
  } else if (combinedRecord.courses && Array.isArray(combinedRecord.courses)) {
    // If courses have semester field, group by semester
    const groupedBySemester = {};
    
    combinedRecord.courses.forEach(course => {
      const sem = course.semester || 1;
      if (!groupedBySemester[sem]) {
        groupedBySemester[sem] = [];
      }
      groupedBySemester[sem].push(course);
    });
    
    Object.entries(groupedBySemester).forEach(([sem, courses]) => {
      semesters.push({
        userId: combinedRecord.userId || combinedRecord._id,
        semester: parseInt(sem),
        academicYear: combinedRecord.academicYear || '2024-2025',
        mentorId: combinedRecord.mentorId || null,
        courses: courses,
        sgpa: 0
      });
    });
  }
  
  return semesters;
}

/**
 * Validate semester document
 */
function validateSemesterDoc(semesterDoc) {
  const valid = validateSemester(semesterDoc);
  return {
    valid,
    errors: valid ? null : validateSemester.errors
  };
}

/**
 * Perform migration (dry run or apply)
 */
async function migrate(isDryRun = true) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${isDryRun ? 'DRY RUN' : 'APPLYING MIGRATION'}: Combined → Semester-wise Academics`);
  console.log(`${'='.repeat(60)}\n`);
  
  const combinedRecords = await findCombinedRecords();
  
  if (combinedRecords.length === 0) {
    console.log('ℹ No records to migrate');
    return { success: true, migratedCount: 0 };
  }
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (const record of combinedRecords) {
    const userId = record.userId || record._id.toString();
    
    try {
      console.log(`\n📝 Processing user: ${userId}`);
      
      // Backup original data
      if (!isDryRun) {
        await Backup.create({
          userId,
          originalData: record
        });
        console.log('  ✓ Backed up original data');
      }
      
      // Parse into semester documents
      const semesterDocs = parseCombinedToSemesters(record);
      console.log(`  ✓ Parsed into ${semesterDocs.length} semester document(s)`);
      
      // Validate each semester document
      for (const semDoc of semesterDocs) {
        const validation = validateSemesterDoc(semDoc);
        
        if (!validation.valid) {
          console.log(`  ✗ Validation failed for semester ${semDoc.semester}`);
          console.log(`    Errors:`, JSON.stringify(validation.errors, null, 2));
          errorCount++;
          errors.push({ userId, semester: semDoc.semester, errors: validation.errors });
          continue;
        }
        
        if (isDryRun) {
          console.log(`  ✓ Would create: Semester ${semDoc.semester} with ${semDoc.courses.length} courses`);
        } else {
          // Create or update semester document
          const existing = await AcademicSemester.findOne({
            userId: semDoc.userId,
            semester: semDoc.semester
          });
          
          if (existing) {
            console.log(`  ⚠ Semester ${semDoc.semester} already exists, skipping`);
          } else {
            const newSemester = new AcademicSemester(semDoc);
            newSemester.computeSGPA();
            await newSemester.save();
            console.log(`  ✓ Created: Semester ${semDoc.semester} (SGPA: ${newSemester.sgpa})`);
          }
        }
      }
      
      // Log migration
      if (!isDryRun) {
        await MigrationLog.create({
          migrationType: 'semester_academics',
          userId,
          action: 'migrate',
          status: 'success',
          details: {
            semestersCreated: semesterDocs.length,
            isDryRun
          }
        });
      }
      
      successCount++;
      
    } catch (error) {
      console.log(`  ✗ Error processing user ${userId}:`, error.message);
      errorCount++;
      errors.push({ userId, error: error.message });
      
      if (!isDryRun) {
        await MigrationLog.create({
          migrationType: 'semester_academics',
          userId,
          action: 'migrate',
          status: 'error',
          error: error.message
        });
      }
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('MIGRATION SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`✓ Successful: ${successCount}`);
  console.log(`✗ Errors: ${errorCount}`);
  
  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(err => {
      console.log(`  - User ${err.userId}: ${err.error || JSON.stringify(err.errors)}`);
    });
  }
  
  if (isDryRun) {
    console.log('\n⚠ This was a DRY RUN. No changes were made.');
    console.log('Run with --apply to apply the migration.');
  } else {
    console.log('\n✓ Migration completed!');
  }
  
  return { success: errorCount === 0, migratedCount: successCount, errors };
}

/**
 * Rollback migration
 */
async function rollback() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('ROLLING BACK MIGRATION');
  console.log(`${'='.repeat(60)}\n`);
  
  const backups = await Backup.find({}).sort({ timestamp: -1 });
  
  if (backups.length === 0) {
    console.log('ℹ No backups found to rollback');
    return { success: true, rolledBackCount: 0 };
  }
  
  console.log(`Found ${backups.length} backup(s) to restore`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const backup of backups) {
    const userId = backup.userId;
    
    try {
      console.log(`\n📝 Rolling back user: ${userId}`);
      
      // Delete semester documents for this user
      const deleteResult = await AcademicSemester.deleteMany({ userId });
      console.log(`  ✓ Deleted ${deleteResult.deletedCount} semester document(s)`);
      
      // Restore original data (to old collection)
      // This would require recreating the old collection structure
      console.log(`  ✓ Original data preserved in backup`);
      
      // Log rollback
      await MigrationLog.create({
        migrationType: 'semester_academics',
        userId,
        action: 'rollback',
        status: 'success',
        details: {
          semestersDeleted: deleteResult.deletedCount
        }
      });
      
      successCount++;
      
    } catch (error) {
      console.log(`  ✗ Error rolling back user ${userId}:`, error.message);
      errorCount++;
      
      await MigrationLog.create({
        migrationType: 'semester_academics',
        userId,
        action: 'rollback',
        status: 'error',
        error: error.message
      });
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log('ROLLBACK SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`✓ Successful: ${successCount}`);
  console.log(`✗ Errors: ${errorCount}`);
  console.log('\n✓ Rollback completed!');
  
  return { success: errorCount === 0, rolledBackCount: successCount };
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || '--dry';
  
  await connectDB();
  
  try {
    if (mode === '--rollback') {
      await rollback();
    } else if (mode === '--apply') {
      await migrate(false);
    } else if (mode === '--dry') {
      await migrate(true);
    } else {
      console.log(`
Usage:
  node scripts/migrate_academics_to_semesters.js --dry      # Dry run (no changes)
  node scripts/migrate_academics_to_semesters.js --apply    # Apply migration
  node scripts/migrate_academics_to_semesters.js --rollback # Rollback migration
      `);
    }
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { migrate, rollback, parseCombinedToSemesters };
