const express = require("express")
const {registerUser, loginUser, getUserProfile} = require("../controller/authController")
const {protect} = require("../middlewares/authMiddleware")
const upload = require('../middlewares/uploadsMiddleware')

const router = express.Router();

// Auth Routes
router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile',protect,getUserProfile);

router.post('/upload-image',upload.single('image'),(req,res)=>{
    if(!req.file) {
        return res.status(400).json({message:"No file uploaded!"})
    }
    const imageURL = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    res.status(200).json({imageURL})
})

module.exports = router; 