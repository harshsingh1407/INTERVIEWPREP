const multer = require("multer")
// const cloudinary = require('cloudinary')
// const {CloudinaryStorage} = require('multer-storage-cloudinary')

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary:cloudinary,
//   params: {
//     folder: "profile_images", // folder name in Cloudinary
//     allowed_formats: ["jpg", "png", "jpeg"],
//   },
// });

// Configure storage
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    },
});

// File filter 
const fileFilter = (req,file,cb)=>{
    const allowedTypes = ['image/jpeg','image/png','image/jpg']
    if(allowedTypes.includes(file.mimetype)) {
        cb(null,true)
    } else {
        cb(new Error('Only .jpeg, .jpg and .png format are allowed'), false)
    }
};



const upload = multer({storage, fileFilter})

module.exports = upload
