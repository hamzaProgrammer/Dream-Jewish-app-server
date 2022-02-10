const Sounds = require('../models/RelaxSoundSchema')
var cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});



// Adding new Sound
const addNewSound = async (req, res) => {
    const { title , desc  } = req.body;

    if (!title || !desc  ) {
        return res.json({
            message: "Please fill All required credentials"
        });
    } else {
        if(req.files.soundFile && req.files.soundFilePic){
            if (req.files.soundFile.mimetype !== "video/mp4") {
                console.log("Video File Not Found")
                return res.status(201).json({
                    success: false,
                    message: 'Ops! Sound File Not Found'
                })
            }
            if (req.files.soundFilePic.mimetype !== "image/png" && req.files.soundFilePic.mimetype !== "image/jpg" && req.files.soundFilePic.mimetype !== "image/jpeg" && req.files.soundFilePic.mimetype !== "image/svg" && req.files.soundFilePic.mimetype !== "image/webp") {
                console.log("Picture  File Not found")
                return res.status(201).json({
                    success: false,
                    message: 'Ops! Sound Pictutre File Not Found'
                })
            }
            //uploading audio first
            await cloudinary.uploader.upload(req.files.soundFile.tempFilePath, {
                    resource_type: "video",
                    public_id: "myfolder/mysubfolder/my_dog",
                    overwrite: true,
                    notification_url: "https://mysite.example.com/notify_endpoint"
                },
                function (error, result) {
                    if(!error){
                        req.body.soundFile = result.url;
                    }
                    console.log("An error in Uplaoding audio : ",   error)
            });

            // uploading audio picture
            await cloudinary.uploader.upload(req.files.soundFilePic.tempFilePath, (err, res) => {
                req.body.soundFilePic = res.url;
            })

            // now saving data
            const newSound = new Sounds({...req.body})
            try {
                const addedSound = await newSound.save();

                res.status(201).json({
                    addedSound,
                    success: true
                })
            } catch (error) {
                console.log("Error in addNewSound and error is : ", error)
                res.status(201).json({ success: false, message: '*** Ops! An error Occured ***'})
            }
        }else{
            res.status(201).json({ success: false, message: '*** Sound and Sound Picture are required ***'})
        }

    }
}

// getting single sound
const getSingleSound = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const singleSound = await Sounds.findById(id);
        if (!singleSound) {
            return res.json({
                success :false,
                message: 'No Sound Found',
            });
        } else {
            return res.json({
                singleSound,
                success: true,
            });
        }
    } catch (error) {
        console.log("Error in getSingleSound and error is : ", error)
        return res.json({
            error,
            success: false,
        });
    }
}

// getting all sound
const getAllSounds = async (req, res) => {
    try {
        const allSounds = await Sounds.find({});
        if (!allSounds) {
            return res.json({
                message: '*** No Sound Found ****',
            });
        } else {
            return res.json({
                allSounds,
                success: true,
            });
        }
    } catch (error) {
        console.log("Error in getAllSounds and error is : ", error)
        return res.json({
            error,
            success: false,
        });
    }
}

// get all Sounds Count
const getAllSoundsCount = async (req, res) => {
    try {
        const count = await Sounds.find({}).count();
        if (!count) {
            return res.json({
                message: '*** No Sound Found ****',
            });
        } else {
            return res.json({
                count,
                success: true
            });
        }
    } catch (error) {
        console.log("Error in getAllSoundsCount and error is : ", error)
        return res.json({
            error,
            success: false
        });
    }
}

// deleting sound
const deleteSound  = async (req, res) => {
    const {id} = req.params
    try {
        const delSound = await Sounds.findByIdAndDelete(id);
        if (!delSound) {
            return res.json({
                message: '*** No Sound Found ****',
            });
        } else {
            return res.json({
                delSound,
                success:true
            });
        }
    } catch (error) {
        console.log("Error in deleteSound  and error is : ", error)
        return res.json({
            error,
            success: false
        });
    }
}

module.exports = {
    addNewSound,
    getSingleSound,
    getAllSounds,
    getAllSoundsCount,
    deleteSound
}