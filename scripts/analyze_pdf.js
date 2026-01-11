const fs = require('fs');

// Same pdf-parse loading as in syllabusRoutes.js
let pdfParse;
const pdfParseModule = require('pdf-parse');
if (pdfParseModule.PDFParse) {
  pdfParse = async (dataBuffer) => {
    const pdf = new pdfParseModule.PDFParse({ data: dataBuffer });
    const result = await pdf.getText();
    return { text: result.text };
  };
} else {
  pdfParse = async (dataBuffer) => {
    const result = await pdfParseModule(dataBuffer);
    return { text: result.text };
  };
}

async function analyze() {
  const buffer = fs.readFileSync('./uploads/syllabus/syllabus-1768139502903-759065456.pdf');
  const { text } = await pdfParse(buffer);
  
  console.log('PDF text length:', text.length);
  
  // Find ALL course code patterns in entire PDF
  const allCodesPattern = /\b(\d{2}[A-Z]{2,4}\d{2,3})\b/g;
  const allCodes = new Set();
  let match;
  while ((match = allCodesPattern.exec(text)) !== null) {
    allCodes.add(match[1].toUpperCase());
  }
  console.log('\n1. ALL unique course code patterns in PDF:', allCodes.size);
  console.log([...allCodes].sort().join(', '));
  
  // Find course codes with "Course Code:" prefix (these are actual course definitions)
  const definedCodesPattern = /Course\s*Code\s*[:\-]?\s*(\d{2}[A-Z]{2,4}\d{2,3})/gi;
  const definedCodes = new Set();
  while ((match = definedCodesPattern.exec(text)) !== null) {
    definedCodes.add(match[1].toUpperCase());
  }
  console.log('\n2. Course codes with "Course Code:" prefix (actual definitions):', definedCodes.size);
  console.log([...definedCodes].sort().join(', '));
  
  // Find codes that appear in allCodes but not in definedCodes
  const undefinedCodes = [...allCodes].filter(c => !definedCodes.has(c));
  console.log('\n3. Codes appearing in PDF but NOT as "Course Code:" definitions:', undefinedCodes.length);
  console.log(undefinedCodes.sort().join(', '));
  
  // Check for each undefined code - is it mentioned as a course somewhere?
  console.log('\n4. Checking undefined codes for course context:');
  for (const code of undefinedCodes.sort()) {
    const codeRegex = new RegExp(`(.{0,100})${code}(.{0,100})`, 'gi');
    const contextMatch = text.match(codeRegex);
    if (contextMatch) {
      const sample = contextMatch[0].replace(/\s+/g, ' ').trim();
      console.log(`\n${code}:`);
      console.log(`  "${sample.substring(0, 150)}..."`);
    }
  }
  
  // Count how many times each code appears
  console.log('\n5. Code occurrence counts (defined courses):');
  for (const code of [...definedCodes].sort()) {
    const regex = new RegExp(code, 'gi');
    const matches = text.match(regex);
    console.log(`  ${code}: ${matches ? matches.length : 0} occurrences`);
  }
}

analyze().catch(console.error);
