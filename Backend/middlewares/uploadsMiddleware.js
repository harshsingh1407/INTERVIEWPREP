const multer = require("multer")
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_images",   // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;

// // Configure storage
// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'uploads/');
//     },
//     filename:(req,file,cb)=>{
//         cb(null,`${Date.now()}-${file.originalname}`)
//     },
// });

// // File filter 
// const fileFilter = (req,file,cb)=>{
//     const allowedTypes = ['image/jpeg','image/png','image/jpg']
//     if(allowedTypes.includes(file.mimetype)) {
//         cb(null,true)
//     } else {
//         cb(new Error('Only .jpeg, .jpg and .png format are allowed'), false)
//     }
// };



// const upload = multer({storage, fileFilter})

// module.exports = upload
