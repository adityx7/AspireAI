const fs = require('fs');

let pdfParse;
const pdfParseModule = require('pdf-parse');
if (pdfParseModule.PDFParse) {
  pdfParse = async (b) => { const p = new pdfParseModule.PDFParse({ data: b }); const r = await p.getText(); return { text: r.text }; };
} else {
  pdfParse = async (b) => { const r = await pdfParseModule(b); return { text: r.text }; };
}

async function check() {
  const buffer = fs.readFileSync('./uploads/syllabus/syllabus-1768139502903-759065456.pdf');
  const { text } = await pdfParse(buffer);
  
  // Courses found with Course Code: prefix
  const withCodeHeader = new Set();
  const pattern = /Course\s*Code\s*[:\-]?\s*(\d{2}[A-Z]{2,4}\d{2,3})/gi;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    withCodeHeader.add(m[1].toUpperCase());
  }
  
  // Courses that have Module-1 content (found earlier)
  const withModules = new Set(['22CIP147', '22CSE132', '22CSE133', '22CSE134', '22CSE135', '22CSE142', '22CSE143', '22CSE144', '22CSE145', '22CSE146', '22CSE151', '22CSE152', '22CSE154', '22CSE155', '22CSE156', '22CSE161', '22CSE162', '22CSE163', '22CSE164', '22CSE165', '22CSE166', '22CSE167', '22CSE171', '22CSE172', '22CSE174', '22MAI131', '22MAI141']);
  
  // What's in withCodeHeader but not in withModules?
  const inHeaderNotModule = [...withCodeHeader].filter(c => !withModules.has(c));
  console.log('In Course Code header but NOT detected as having modules:', inHeaderNotModule.length);
  console.log(inHeaderNotModule.join(', '));
  
  // Check these specifically
  console.log('\nChecking these courses for module content:');
  for (const code of inHeaderNotModule) {
    const idx = text.indexOf('Course Code: ' + code) || text.indexOf('Course Code:' + code);
    if (idx > -1) {
      const section = text.substring(idx, idx + 4000);
      const hasModule = /Module\s*[-–]?\s*[12345]\s*[:\-]/gi.test(section);
      console.log(`  ${code}: ${hasModule ? 'HAS modules' : 'NO modules'}`);
    }
  }
  
  // Union = all actual courses
  const allCourses = new Set([...withCodeHeader, ...withModules]);
  console.log('\nTOTAL unique courses with Course Code header OR Module content:', allCourses.size);
  console.log([...allCourses].sort().join(', '));
}
check().catch(console.error);
