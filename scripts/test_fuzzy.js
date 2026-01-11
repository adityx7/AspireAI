// Test the fuzzy matching function
function extractCourseNumber(courseCode) {
  if (!courseCode) return null;
  const match = courseCode.match(/\d{2}[A-Z]{2,4}(\d{2,3})$/i);
  return match ? match[1] : null;
}

console.log('22AML132 ->', extractCourseNumber('22AML132'));
console.log('22CSE132 ->', extractCourseNumber('22CSE132'));
console.log('22MAI131 ->', extractCourseNumber('22MAI131'));
console.log('22CIP147 ->', extractCourseNumber('22CIP147'));

console.log('');
console.log('Do 22AML132 and 22CSE132 match?', extractCourseNumber('22AML132') === extractCourseNumber('22CSE132'));
