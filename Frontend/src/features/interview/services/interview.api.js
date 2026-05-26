import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/**
 * @description service to generate interview report
 */
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();

  // field names must match backend
  formData.append('JobDescription', jobDescription);

  formData.append('selfDescription', selfDescription);

  // multer field name
  formData.append('resume', resumeFile);

  const response = await api.post('/api/interview/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * @description service to get interview report by interviewId
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);

  return response.data;
};

/**
 * @description service to get all interview reports
 */
export const getAllInterviewReport = async () => {
  const response = await api.get('/api/interview/');

  return response.data;
};

/**
 * @description service to generate and download resume pdf
 */
export const generateResumePdf = async (interviewReportId) => {
  const response = await api.post(
    `/api/interview/resume/pdf/${interviewReportId}`,
    {},
    {
      responseType: 'blob',
    }
  );

  return response.data;
};

export default api;
