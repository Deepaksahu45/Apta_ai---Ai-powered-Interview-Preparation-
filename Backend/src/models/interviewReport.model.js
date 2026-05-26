const mongoose = require('mongoose');

/**
 * - Jobs description schema : String
 * - resume text : String
 * - self description : String
 *
 * MatchScore : Number
 *
 * - Technical questions : [{
 *      question : String,
 *      intension : String,
 *      answer : String,
 * }]
 * - Behavioral questions : [{
 *       question : String,
 *       intension : String,
 *       answer : String,
 * }]
 *
 * - Skills gaps : [{
 *      skill: String,
 *      severity: String,
 *      type: String,
 *      enum: ["low" , "medium" , "high"]
 * }]
 * - Preparation plan : [{
 *       day : Number,
 *       focus : String,
 *       tasks : [String]
 * }]
 */

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Technical question is required'],
    },
    intention: {
      type: String,
      required: [true, 'Intension is required'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
    },
  },
  {
    _id: false,
  }
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Behavioral question is required'],
    },
    intention: {
      type: String,
      required: [true, 'Intension is required'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
    },
  },
  {
    _id: false,
  }
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, 'Skill is required'],
    },
    severity: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      required: [true, 'Severity is required'],
    },
  },
  {
    _id: false,
  }
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, 'Day is required'],
    },
    focus: {
      type: String,
      required: [true, 'Focus is required'],
    },
    tasks: {
      type: [String],
      required: [true, 'Tasks are required'],
    },
  },
  {
    _id: false,
  }
);

const interviewReportSchema = new mongoose.Schema({
  JobDescription: {
    type: String,
    required: [true, 'job description is required'],
  },
  resume: {
    type: String,
  },
  selfDescription: {
    type: String,
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  technicalQuestions: [technicalQuestionSchema],
  behavioralQuestions: [behavioralQuestionSchema],
  skillGaps: [skillGapSchema],
  preparationPlan: [preparationPlanSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
  },
});
const InterviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = InterviewReportModel;
