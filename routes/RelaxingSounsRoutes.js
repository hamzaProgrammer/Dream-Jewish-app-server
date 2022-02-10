const express = require('express');
const router = express.Router();
const {
    addNewSound,
    getSingleSound,
    getAllSounds,
    getAllSoundsCount,
    deleteSound
} = require('../controllers/SoundsController')
// const multer = require("multer")
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '../client/public/sounds/')
//         //cb(null, '../products')
//     },
//     filename: function (req, file, cb) {
//         cb(null, 'image-' + Date.now() + file.originalname)
//     }
// })
// const upload = multer({
//     storage: storage,
// });


// Adding New Sound
router.post('/api/sound/addNew' , addNewSound)

// getting single Sound
router.get('/api/sound/getSingle/:id', getSingleSound)

// getting all Sounds
router.get('/api/sound/getAll', getAllSounds)

// get all sounds Count
router.get('/api/sound/getAll/count', getAllSoundsCount)


// Update sound info
// router.put('/api/user/updateUserInfo/:id', updateUser);

// Delete Sound
router.delete('/api/sound/deleteSound/:id', deleteSound)

// // // get all admins
// // // router.post('/api/cutomer/checkEmailExists', sendMail)


module.exports = router;