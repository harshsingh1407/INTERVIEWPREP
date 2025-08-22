export const BASE_URL = "http://localhost:8000"

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", // Signup
        LOGIN: "/api/auth/login", // Authentication user & return JWT token
        GET_PROFILE: "/api/auth/profile", // Get logged-in user details
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image", //Upload profile picture
    },
    AI: {
        GENERATE_QUESTIONS: "/api/ai/generate-questions", //Generate interview questions an answer using Gemini
        GENERATE_EXPLANATION: "/api/ai/generate-explanation", //Generate concept explanation using Gemini
    },
    SESSIONS: {
        CREATE: "/api/sessions/create", //Create a new interview session with questions
        GET_ALL: "/api/sessions/my-sessions", // Get all user session
        GET_ONE: (id)=> `/api/sessions/${id}`, // Get session detailed with questions
        DELETE: (id)=> `/api/sessions/${id}`, // Delete a session
    },
    QUESTION: {
        ADD_TO_SESSION: "/api/question/add", //Add more questions to session
        PIN: (id)=> `/api/question/${id}/pin`, //Pin or unpin a question
        UPDATE_NOTE: (id)=> `/api/questions/${id}/note`, //Update/Add a note to a question
    },
}