const pdfParse = require('pdf-parse');
const {
  generateInterviewReports,
  generateResumePdf,
} = require('../services/ai.services.js');
const interviewReportModel = require('../models/interviewReport.model.js');

/**
 * @description generate the new report on the basis of the resume , self description and job description of the candidate
 */
const generateInterviewReportController = async (req, res) => {
  // const resumeContent = await new pdfParse.PDFParse(
  //   Uint8Array.from(req.file.buffer)
  // ).getText();
  // const { selfDescription, JobDescription } = req.body;

  // const interviewReportByAi = await generateInterviewReports({
  //   resume: resumeContent.text,
  //   selfDescription,
  //   JobDescription,
  // });

  // const interviewReport = await interviewReportModel.create({
  //   user: req.user.id,
  //   resume: resumeContent.text,
  //   selfDescription,
  //   JobDescription,
  //   ...interviewReportByAi,
  // });

  // res.status(200).json({ interviewReport });
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Resume file is required',
      });
    }

    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(req.file.buffer)
    ).getText();

    const { selfDescription, JobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReports({
      resume: resumeContent.text,
      selfDescription,
      jobDescription: JobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent.text,
      selfDescription,
      JobDescription,
      ...interviewReportByAi,
    });

    res.status(200).json({ interviewReport });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

/**
 *@description controller to get interview report by interview id
 */
const getInterviewReportByIdController = async (req, res) => {
  const { interviewId } = req.params;
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({ message: 'Interview report not found' });
  }
  res
    .status(200)
    .json({ message: 'interview report fetched successfully', interviewReport });
};

const getAllInterviewReportController = async (req, res) => {
  const interviewReport = await interviewReportModel
    .find({ user: req.user.id })
    .sort({
      createdAt: -1,
    })
    .select(
      '-resume -selfDescription -JobDescription -__v -updatedAt -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan'
    );

  res
    .status(200)
    .json({ message: 'interview report fetched successfully', interviewReport });
};

/**
 * @description controller to generate resume pdf based on user self description , job description and resume
 */

const generateResumePdfController = async (req, res) => {
  const { interviewReportId } = req.params;
  const interviewReport = await interviewReportModel.findById(interviewReportId);
  if (!interviewReport) {
    return res.status(404).json({ message: 'Interview report not found' });
  }

  const { resume, selfDescription, JobDescription } = interviewReport;
  const pdfBuffer = await generateResumePdf({
    resume,
    selfDescription,
    jobDescription: JobDescription,
  });
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`,
  });
  res.send(pdfBuffer);
};

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportController,
  generateResumePdfController,
};
