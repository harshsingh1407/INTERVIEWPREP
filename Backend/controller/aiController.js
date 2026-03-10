const { GoogleGenAI } = require('@google/genai')
const { conceptExplainPrompt, questionAnswerPrompt } = require('../utils/Prompt')
const Question = require('../models/Question')



// @desc Generate interview questions and answer using Gemini
// @route POST /api/ai/generate-questions
// @access Private
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body
        if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ message: 'Missing required fields' })
        }
        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions)
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        })
        let rawText = response.text;
        // Clean it: Remove ```json and ``` from beginning and end
        const cleannedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim();
        // Now safe to parse
        const data = JSON.parse(cleannedText)
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate question', error: error.message })
    }
}

// @desc Generate explains a interview question
// @route POST /api/ai/generate-explanation
// @access Private
const generateConceptExplanations = async (req, res) => {
    try {
        const { question, questionId } = req.body;
        if (!question) {
            return res.status(404).json({ message: "Missing required fields" })
        }

        // If questionId is provided, check if explanation already exists
        if (questionId) {
            const existingQuestion = await Question.findById(questionId);
            if (existingQuestion && existingQuestion.explanation) {
                return res.status(200).json(existingQuestion.explanation);
            }
        }

        const prompt = conceptExplainPrompt(question)
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        })
        let rawText = response.text;
        // Clean it: Remove ```json and ``` from beginning and end
        const cleannedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim();
        // Now safe to parse
        const data = JSON.parse(cleannedText)

        // Save the generated explanation to the database
        if (questionId) {
            await Question.findByIdAndUpdate(questionId, { explanation: data });
        }

        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate question', error: error.message })
    }
}

module.exports = { generateInterviewQuestions, generateConceptExplanations }