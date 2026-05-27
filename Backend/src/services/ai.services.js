const { GoogleGenAI } = require('@google/genai');
const { default: zodToJsonSchema } = require('zod-to-json-schema');
const puppeteer = require('puppeteer');
const { z } = require('zod');

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const generateInterviewReports = async ({ resume, selfDescription, jobDescription }) => {
  try {
    const prompt = `
Generate a complete interview report for the candidate.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do not add markdown.
3. Follow exact schema.
4. Do not leave any array empty.
5. technicalQuestions must contain at least 5 items.
6. behavioralQuestions must contain at least 5 items.
7. skillGaps must contain at least 5 items.
8. preparationPlan must contain 7 items.
9. Keep answers concise.
10. For skill severity use ONLY:
   - Low
   - Moderate
   - High

Generate:
- Match score
- Technical interview questions
- Behavioral interview questions
- Skill gaps
- Preparation plan
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',

      contents: prompt,

      config: {
        responseMimeType: 'application/json',

        responseSchema: {
          type: 'OBJECT',

          properties: {
            title: {
              type: 'STRING',
            },

            matchScore: {
              type: 'NUMBER',
            },

            technicalQuestions: {
              type: 'ARRAY',

              items: {
                type: 'OBJECT',

                properties: {
                  question: {
                    type: 'STRING',
                  },

                  intention: {
                    type: 'STRING',
                  },

                  answer: {
                    type: 'STRING',
                  },
                },
              },
            },

            behavioralQuestions: {
              type: 'ARRAY',

              items: {
                type: 'OBJECT',

                properties: {
                  question: {
                    type: 'STRING',
                  },

                  intention: {
                    type: 'STRING',
                  },

                  answer: {
                    type: 'STRING',
                  },
                },
              },
            },

            skillGaps: {
              type: 'ARRAY',

              items: {
                type: 'OBJECT',

                properties: {
                  skill: {
                    type: 'STRING',
                  },

                  severity: {
                    type: 'STRING',
                  },
                },
              },
            },

            preparationPlan: {
              type: 'ARRAY',

              items: {
                type: 'OBJECT',

                properties: {
                  day: {
                    type: 'NUMBER',
                  },

                  focus: {
                    type: 'STRING',
                  },

                  tasks: {
                    type: 'ARRAY',

                    items: {
                      type: 'STRING',
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log('\nRAW RESPONSE:\n');

    console.log(response.text);

    const result = JSON.parse(response.text);

    console.log('\nPARSED RESULT:\n');

    console.log(JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.log('AI SERVICE ERROR:\n', error);
  }
};

const generatePdfFromHtml = async (htmlContent) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0',
  });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '15mm',
      right: '15mm',
    },
  });

  await browser.close();

  return pdfBuffer;
};

const generateResumePdf = async ({ resume, selfDescription, jobDescription }) => {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        'The HTML content of the resume which can be converted to PDF using any library like puppeteer'
      ),
  });

  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
};

module.exports = { generateInterviewReports, generateResumePdf };
