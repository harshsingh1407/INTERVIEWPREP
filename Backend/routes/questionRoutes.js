const express = require('express')
const { togglePinQuestions, updateQuestionNote, addQuestionsToSession } = require('../controller/questionController');
const { protect } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/add', protect, addQuestionsToSession)
router.post('/:id/pin', protect, togglePinQuestions)
router.post('/:id/note', protect, updateQuestionNote)

module.exports = router