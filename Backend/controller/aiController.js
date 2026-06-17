const { GoogleGenAI } = require('@google/genai')
const { conceptExplainPrompt, questionAnswerPrompt } = require('../utils/Prompt')
const Question = require('../models/Question')
const callGeminiWithFallback = async (ai, prompt) => {
    const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro"]
    let lastError = null

    for (const model of models) {
        try {
            console.log(`Attempting generation with model: ${model}`)
            const response = await ai.models.generateContent({
                model: model,
                contents: prompt
            })
            if (response && response.text) {
                console.log(`Successfully generated content using model: ${model}`)
                return response
            }
        } catch (error) {
            console.warn(`Model ${model} failed:`, error.message)
            lastError = error
        }
    }

    throw new Error(`All Gemini models failed. Last error: ${lastError ? lastError.message : "Unknown error"}`)
}

// @desc Generate interview questions and answer using Gemini
// @route POST /api/ai/generate-questions
// @access Private
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body
        if (!role || experience === undefined || experience === null || experience === "" || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const trimmedRole = String(role).trim()
        const trimmedTopics = String(topicsToFocus).trim()

        if (trimmedRole.length < 2) {
            return res.status(400).json({ message: 'Target Position must be a valid job title (at least 2 characters).' })
        }

        const expNum = Number(experience)
        if (isNaN(expNum) || expNum < 0 || expNum > 20) {
            return res.status(400).json({ message: 'Experience must be a number between 0 and 20 years.' })
        }

        if (trimmedTopics.length < 2) {
            return res.status(400).json({ message: 'Core Focus Skills must contain valid skills or frameworks (at least 2 characters).' })
        }

        const prompt = questionAnswerPrompt(trimmedRole, expNum, trimmedTopics, numberOfQuestions)
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
        const response = await callGeminiWithFallback(ai, prompt)
        let rawText = response.text;
        // Clean it: Remove ```json and ``` from beginning and end
        const cleannedText = rawText
            .replace(/^```json\s*/, "")
            .replace(/```$/, "")
            .trim();
        // Now safe to parse
        const data = JSON.parse(cleannedText)

        // Check if the AI returned a validation error object
        if (data && !Array.isArray(data) && data.error) {
            return res.status(400).json({ message: data.error })
        }

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
        const response = await callGeminiWithFallback(ai, prompt)
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