require('dotenv').config();
const app = require('./src/app');
const dbConnect = require('./src/config/database.js');
// const invokeGeminiAi = require('./src/services/ai.services.js');

dbConnect();
// invokeGeminiAi();
// generateInterviewReports({ resume, selfDescription, jobDescription });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
