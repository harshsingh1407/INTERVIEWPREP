const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

// Generate JWT Token
const generateToken = (userID) => {
    return jwt.sign({ id: userID }, process.env.JWT_SECRET, { expiresIn: "7D" })
}

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exist
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User Already Exists" })
        }
        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)
        // Create new user

        // Cloudinary Uploads 
        let profileImageUrl = null;
        if (req.file) {
            profileImageUrl = req.file.path; // 👈 Cloudinary gives secure_url here
        }
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
        })
        // Return user data with JWT
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", err: err.message })
    }
}

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }
        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }
        // Return user data with JWT
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error", err: err.message })
    }
}

// @desc Get profile user
// @route POST /api/auth/profile
// @access Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user)
    } catch (err) {
        res.status(500).json({ message: "Server error", err: err.message })
    }
}

module.exports = { registerUser, loginUser, getUserProfile }