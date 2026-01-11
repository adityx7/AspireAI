const fs = require('fs');

// Handle pdf-parse v2 API
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

async function check() {
  const buffer = fs.readFileSync('./uploads/syllabus/syllabus-1768139502903-759065456.pdf');
  const { text } = await pdfParse(buffer);
  
  // Check for Module-1 near these undefined codes
  const undefinedCodes = ['22MAT131', '22MAT141', '22SFT148', '22CSE137', '22CSE149', '22CSE157', '22CSE158', '22CSE168', '22CSE175', '22CSE182', '22CSE183'];
  
  console.log('Checking if undefined course codes have Module content:\n');
  
  for (const code of undefinedCodes) {
    // Find code position
    const idx = text.indexOf(code);
    if (idx > -1) {
      // Check 3000 chars after for Module-1
      const section = text.substring(idx, idx + 3000);
      const hasModule = /Module\s*[-–]?\s*1\s*[:\-]/i.test(section);
      const hasCourseCode = /Course\s*Code\s*[:\-]?\s*/.test(section.substring(0, 500));
      console.log(`${code}: ${hasModule ? '✅ Has Module 1' : '❌ No Module content'} | ${hasCourseCode ? 'Has Course Code header' : 'Just table entry'}`);
      
      // Show first 200 chars of context
      console.log(`  Context: "${section.substring(0, 200).replace(/\s+/g, ' ').trim()}..."\n`);
    }
  }
}

check().catch(console.error);
