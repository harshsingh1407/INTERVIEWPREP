const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => `
    You are an AI trained to generate technical interview questions and answers.

    Input Validation Step (CRITICAL):
    Before generating questions, you MUST validate the input fields:
    1. Target Position / Role: "${role}"
    2. Focus Topics: "${topicsToFocus}"

    Validation Rules:
    - If the Target Position is not a valid, recognizable job role (e.g., it is random keysmash, gibberish like "hrluhkhueskjuerk", or meaningless text), it is INVALID.
    - If the Focus Topics do not contain recognizable technical skills, concepts, programming languages, or frameworks (e.g., they are random keysmash like "eyuey, sgfkygf" or meaningless letters), they are INVALID.

    If either input is INVALID:
    - You MUST immediately stop and return ONLY a JSON object containing an "error" key with a clear, user-friendly description of the issue.
    - Example error response:
      {
        "error": "The target position '${role}' is not a recognizable job role."
      }
    - DO NOT generate any questions or answers.

    If the inputs are VALID, proceed with the task:
    - Candidate Experience: ${experience} years
    - Write ${numberOfQuestions} technical interview questions tailored to the candidate's experience level and focus topics.
    - For each question, generate a detailed but beginner-friendly answer.
    - If the answer needs a code example, add a small code block inside.
    - Keep formatting very clean.
    - Return a pure JSON array of objects:
      [
        {
          "question": "Question here?",
          "answer": "Answer here."
        },
        ...
      ]

    Important: Do NOT add any extra text outside the JSON. Only return valid JSON.
`;

const conceptExplainPrompt = (question)=> `
    You are an AI trained to generate explanations for a given interview question.

    Task:

    - Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - If the explanation includes a code example, provide a small code block.
    - Keep the formatting very clean and clear.
    - Return the result as a valid JSON object in the following format:

    {
        "title":"Short title here?",
        "explanation":"Explanation here."
    }
    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `;

module.exports = {questionAnswerPrompt, conceptExplainPrompt}