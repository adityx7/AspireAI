const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const spreadsheetId = "1tye61lCFDIK7gR0jiTuMLP1TJN0oZh7fuodeJT2mdXQ";
const SHEET_NAME = "Form Responses 1";
const key = "AIzaSyAvsbC4c8VMWqnxIqWfQ8zAeUXg2jvF8hE";
const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
const app = express();
const port = 5001;
const bodyParser = require("body-parser");

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({}));
app.use(bodyParser.json({ })); // Increase limit for large images

// Load Google Service Account Credentials
const credentialsPath = path.join(__dirname, "quiet-subset-422805-u2-36743389283f.json");
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

// Authenticate with Google Sheets API
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

// SWOT and Career Scoring System
const SWOT_CATEGORIES = {
  Strengths: [
    "I can find creative solutions to problems.",
    "I enjoy learning new skills or knowledge.",
    "I can quickly adjust to new situations and environments.",
    "I actively seek to build and maintain meaningful relationships.",
    "I believe in my ability to handle challenges effectively.",
    "I feel confident leading a team or initiative.",
    "I know how to utilize resources effectively.",
    "I am open to feedback and willing to improve.",
    "I can express my thoughts and ideas clearly.",
    "I feel confident using modern technology for work."
  ],
  Weaknesses: [
    "I struggle to prioritize tasks effectively.",
    "I feel unsure or hesitant when making decisions.",
    "I find it hard to stay calm under pressure.",
    "I often delay tasks until the last minute.",
    "I tend to overthink or aim for unrealistic standards.",
    "I worry about failing and its consequences.",
    "I feel easily influenced by others' opinions or pressure.",
    "I often question my abilities and decisions.",
    "I find it challenging to compete in highly competitive environments.",
    "I find it hard to handle disagreements or confrontations."
  ],
  Opportunities: [
    "I can easily understand and share the feelings of others.",
    "I can think outside the box and come up with innovative ideas.",
    "I can express my opinions clearly without hesitation.",
    "I proactively take action without waiting for instructions.",
    "I bounce back quickly from setbacks and failures.",
    "I am open to learning about and understanding different cultures.",
    "I work well with people from diverse backgrounds.",
    "I can think ahead and develop long-term plans.",
    "I am always eager to explore and learn new things.",
    "I am comfortable stepping out of my comfort zone to try new approaches.",
  ],
  Threats: [
    "I struggle to trust others with tasks I am responsible for.",
    "I get easily distracted while working on important tasks.",
    "I find it hard to stick to my plans or routines.",
    "I often take on more tasks than I can handle.",
    "I often feel like my accomplishments are due to luck, not skill.",
    "I feel discouraged or upset when receiving negative feedback.",
    "I spend too much time analyzing a situation without acting on it.",
    "I feel uncomfortable or anxious about changes in my environment.",
    "I feel stressed when trying to outperform others in a competitive setting."
  ]
};

const CAREER_CATEGORIES = {
  "Creative & Artistic": [
    "I enjoy being creative and expressing ideas visually or in writing.",
    "I like designing or creating art, music, or literature.",
    "I thrive on creativity and self-expression."
  ],
  "Research & Analytical": [
    "I like exploring, researching, and analyzing data.",
    "I conduct scientific experiments or analyze data.",
    "I feel confident in my technical or programming skills."
  ],
  "Social & Helping": [
    "I feel energized when helping or teaching others.",
    "I enjoy counseling, teaching, or mentoring others.",
    "I want to make a positive social impact through my work."
  ],
  "Leadership & Management": [
    "I like persuading others, leading, or managing projects.",
    "I enjoy roles where I can lead and make decisions independently.",
    "I feel confident in my leadership and team management skills.",
    "I aim to achieve recognition or influence in my field."
  ],
  "Technical & Practical": [
    "I enjoy hands-on, practical tasks like building or repairing.",
    "I feel confident in my technical or programming skills.",
    "I feel comfortable working with modern technology in my career."
  ],
  "Entrepreneurial & Business": [
    "I aim to achieve recognition or influence in my field.",
    "I prioritize financial stability in my career.",
    "I like working autonomously and flexibly."
  ],
  "Flexible & Independent": [
    "I enjoy roles where I can work autonomously and flexibly.",
    "I prefer a career that aligns with my personal interests or hobbies.",
    "I prefer working in a fast-paced, dynamic environment."
  ]
};

const CAREER_SUGGESTIONS = {
  "Creative & Artistic": [
    "Graphic Designer", "Photographer", "Writer", "Illustrator", "Fashion Designer",
    "Animator", "Interior Designer", "Musician", "Film Director", "Set Designer"
  ],
  "Research & Analytical": [
    "Data Scientist", "Engineer", "Biochemist", "Statistician", "Research Analyst",
    "Economist", "Geologist", "Mathematician", "Cybersecurity Analyst", "Quantitative Analyst"
  ],
  "Social & Helping": [
    "Counselor", "Teacher", "HR Specialist", "Social Worker", "Psychologist",
    "Therapist", "Speech Therapist", "Nurse", "Public Health Specialist", "Event Planner"
  ],
  "Leadership & Management": [
    "Business Consultant", "Marketing Manager", "CEO", "Project Manager", "Product Manager",
    "Operations Manager", "Financial Controller", "Supply Chain Manager", "Executive Director", "Team Lead"
  ],
  "Technical & Practical": [
    "IT Specialist", "Electrician", "CAD Designer", "Web Developer", "Software Engineer",
    "Database Administrator", "Mechanical Engineer", "Construction Manager", "System Administrator", "Network Engineer"
  ],
  "Entrepreneurial & Business": [
    "Startup Founder", "Financial Analyst", "Sales Manager", "Product Owner", "Venture Capitalist",
    "Business Analyst", "Marketing Specialist", "E-commerce Entrepreneur", "Real Estate Developer", "Operations Director"
  ],
  "Flexible & Independent": [
    "Freelancer", "Life Coach", "Digital Nomad", "Content Creator", "Consultant",
    "Travel Blogger", "Virtual Assistant", "Independent Contractor", "Personal Trainer", "Online Educator"
  ]
};

const calculateScores = (userData, categoryList, categoryName) => {
  let scores = {};

  console.log(`\n========= ${categoryName} Responses =========`); // Category Header

  Object.keys(categoryList).forEach((category) => {
    scores[category] = categoryList[category].reduce((acc, statement) => {
      // Normalize headers by trimming and converting to lowercase
      const normalizedStatement = statement.trim().toLowerCase();

      // Log debug information
      console.log(`Checking: "${normalizedStatement}"`);

      // Find the closest key match in userData
      const matchedKey = Object.keys(userData).find(
        (key) => key.trim().toLowerCase() === normalizedStatement
      );

      let score = 0;

      if (matchedKey) {
        score = parseInt(userData[matchedKey] || "0", 10);
        if (isNaN(score)) score = 0;

        // Log question and score
        console.log(`✅ Matched Q: "${matchedKey}" → Score: ${score}`);
      } else {
        console.warn(`❌ Q: "${statement}" → Not Found in user data!`);
      }

      return acc + score;
    }, 0);
  });

  console.log(`Final Scores:`, scores);
  return scores;
};

app.post("/fetch-data", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received request with email:", email);

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: SHEET_NAME,
    });

    const [headers, ...rows] = response.data.values;
    const emailIndex = headers.indexOf("Email");
    if (emailIndex === -1) return res.status(500).json({ error: "Email column not found" });

    const userRow = rows.find((row) => row[emailIndex] === email);
    const userName = userRow[1];
    console.log("User Name :", userRow[1]);
    if (!userRow) return res.status(404).json({ error: "User not found" });

    const userData = headers.reduce((acc, header, index) => {
      acc[header] = userRow[index] || "0"; // Ensure no undefined values
      return acc;
    }, {});

    console.log("Extracted User Data:", JSON.stringify(userData, null, 2));

    // Compute SWOT and Career scores
    const swotScores = calculateScores(userData, SWOT_CATEGORIES);
    const careerScores = calculateScores(userData, CAREER_CATEGORIES);
    console.log("SWOT Scores:", swotScores);
    console.log("Career Scores:", careerScores);

    // Determine highest career match
    const bestCareerCategory = Object.keys(careerScores).reduce((a, b) =>
      careerScores[a] > careerScores[b] ? a : b
    );

    const suggestedCareers = CAREER_SUGGESTIONS[bestCareerCategory] || ["No suggestions available"];

    console.log("Response data being sent:", JSON.stringify({
      success: true,
      data: {
        userName,
        userData,
        swotScores,
        careerScores,
        bestCareerCategory,
        suggestedCareers,
      }
    }, null, 2));

    const prompt = `
      Analyze the following SWOT and career-related data in detail and provide personalized career advice and character behavioural enhancements suggestions:
      
      User Information:
      ${JSON.stringify(userData, null, 2)}

      SWOT Scores:
      ${JSON.stringify(swotScores, null, 2)}

      Career Scores:
      ${JSON.stringify(careerScores, null, 2)}

      Best Career Category:
      ${bestCareerCategory}

      Suggested Careers:
      ${suggestedCareers.join(", ")}

      Provide insights on how the user can improve their career prospects and what and where they can improve themselves in the SWOT characteristics and make the best use of their strengths.
    `;

    const result = await model.generateContent(prompt);
    const responseContent = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from the LLM";

    res.json({
      success: true,
      data: {
        userName,
        userData,
        swotScores,
        careerScores,
        bestCareerCategory,
        suggestedCareers,
        responseContent,
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/generate-report", async (req, res) => {
  try {
    const { userName, responseContent, swotChartImage, careerChartImage } = req.body;
    if (!userName || !responseContent) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const reportsDir = path.join(__dirname, "reports");

    // Create "reports" directory if it doesn't exist
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const filePath = path.join(reportsDir, "Career_Report.pdf");
    const pdfDoc = new PDFDocument({ margin: 50 });

    const stream = fs.createWriteStream(filePath);
    pdfDoc.pipe(stream);

    // 🎯 **Title**
    pdfDoc.font("Times-Bold").fontSize(20).text("Career Analysis Report", { align: "center" });
    pdfDoc.moveDown(2);

    // 🎯 **User's Name**
    pdfDoc.font("Times-Roman").fontSize(12).text(`Candidate: ${userName}`);
    pdfDoc.moveDown(1);

    pdfDoc.font("Times-Bold").text("Analysis:", { underline: true });
    pdfDoc.moveDown(1);

    // 🎯 **Process Text Line by Line**
    const reportLines = responseContent.split("\n");

    reportLines.forEach((line) => {
      if (!line.trim()) {
        pdfDoc.moveDown(1);
        return;
      }

      let processedText = line.replace(/\*\*/g, "");

      processedText.split(/(<.*?>)/).forEach((part) => {
        if (part.startsWith("<") && part.endsWith(">")) {
          pdfDoc.font("Times-Bold").fontSize(10).text(part.slice(1, -1), { align: "justify" });
        } else {
          pdfDoc.font("Times-Roman").fontSize(10).text(part, { align: "justify" });
        }
      });

      pdfDoc.moveDown(1);
    });

    // 🎯 **Insert SWOT Analysis Graph**
    if (swotChartImage) {
      pdfDoc.addPage(); // Start a new page for charts
      // pdfDoc.fontSize(16).text("SWOT Analysis Graph", { align: "center" });
      pdfDoc.moveDown(2);
      const swotBuffer = Buffer.from(swotChartImage.split(",")[1], "base64");
      pdfDoc.image(swotBuffer, { fit: [400, 250], align: "center", valign:"center" });
      pdfDoc.moveDown()
    }

    // 🎯 **Insert Career Pie Chart**
    if (careerChartImage) {
      // pdfDoc.fontSize(16).text("Career Pie Chart", { align: "center" });
      pdfDoc.moveDown(25);
      const careerBuffer = Buffer.from(careerChartImage.split(",")[1], "base64");
      pdfDoc.image(careerBuffer, { fit: [400, 250], align: "center", valign:"center" });
    }

    // 🎯 **Footer**
    pdfDoc.moveDown(33);
    pdfDoc.fillColor("blue").font("Times-Bold").fontSize(12).text("Generated by Career Compass", { align: "center" });

    pdfDoc.end();

    stream.on("finish", () => {
      res.download(filePath);
    });

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
