const express = require("express")
const { registerUser, loginUser, getUserProfile } = require("../controller/authController")
const { protect } = require("../middlewares/authMiddleware")

// Cloudinary upload middleware
const upload = require('../middlewares/uploadsMiddleware')

const router = express.Router();

// Auth Routes
router.post('/register',upload.single("profileImage"), registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

router.post('/upload-image', upload.single('image'), (req, res) => {

    // const host = req.get("host");
    // let protocol = req.protocol;

    // Force https in production (Render uses HTTPS)
    // if (host.includes("onrender.com")) {
    //     protocol = "https";
    // }

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded!" })
    }
    // const imageURL = `${protocol}://${host}/uploads/${req.file.filename}`
    res.status(200).json({ imageURL: req.file.path })
})

module.exports = router; 