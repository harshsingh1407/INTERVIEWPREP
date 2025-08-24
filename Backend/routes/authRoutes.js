const express = require("express")
const { registerUser, loginUser, getUserProfile } = require("../controller/authController")
const { protect } = require("../middlewares/authMiddleware")
const upload = require('../middlewares/uploadsMiddleware')

const router = express.Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

router.post("/upload-profile", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.path; // ⚡ Cloudinary gives this directly
    // Save in MongoDB
    user.profileImageUrl = imageUrl;
    await user.save();

    res.json({ imageURL: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.post("/upload-image", upload.single("profileImage"), (req, res) => {
//   try {
//     // Cloudinary returns the file info in req.file.path
//     res.json({ imageURL: req.file.path });
//   } catch (error) {
//     res.status(500).json({ message: "Upload failed", error });
//   }
// });

// router.post('/upload-image', upload.single('image'), (req, res) => {

//     const host = req.get("host");
//     let protocol = req.protocol;

//     // Force https in production (Render uses HTTPS)
//     if (host.includes("onrender.com")) {
//         protocol = "https";
//     }

//     if (!req.file) {
//         return res.status(400).json({ message: "No file uploaded!" })
//     }
//     const imageURL = `${protocol}://${host}/uploads/${req.file.filename}`
//     res.status(200).json({ imageURL })
// })

module.exports = router; 