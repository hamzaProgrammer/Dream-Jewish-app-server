const SubCategories = require('../models/SubCateSchema')
const Dreams = require('../models/DreamSchema')
const mongoose = require("mongoose")

// adding new Dream
const addNewDream = async (req, res) => {
    const {title , parent , desc} = req.body;
    if (!title || !parent || !desc ) {
        return res.json({
            message: "Please Provide All Credientials"
        });
    } else {
        const check = await Dreams.find({
            title: title
        })
        if (check.length > 0) {
            return res.json({
                message: '*** Title Already Exists ***'
            })
        } else {
            const newDream = new Dreams({
                ...req.body
            })
            try {
                const addedDream = await newDream.save();
                console.log("Id : ", addedDream._id)
                // adding newly created sub category into main
                let ww = await SubCategories.findByIdAndUpdate(parent , {$push : {dreams : addedDream._id }} , {new : true})

                res.status(201).json({
                    addedDream,
                    success: true
                })
            } catch (error) {
                console.log("Error in addNewDream and error is : ", error)
                res.status(201).json({
                    error,
                    success: false
                })
            }
        }
    }
}

// uodate Dream
const updateDream = async (req, res) => {
    const {
        id
    } = req.params
    console.log("Id : ", id)
    if (!id) {
        return res.status(201).json({
            message: '*** Id is Required for Updation ****'
        })
    } else {
        const isExist = await Dreams.findById(id)
        if (!isExist) {
            return res.status(201).json({
                message: '*** Users Id is Incorrect ****'
            })
        } else {
            isExist.title = req.body.title;
            isExist.desc = req.body.desc
            try {
                const updatedUser = await Dreams.findByIdAndUpdate(id, {
                    $set: isExist
                }, {
                    new: true
                })
                res.status(201).json({
                    updatedUser,
                    success: true
                })

            } catch (error) {
                console.log("Error in updateDream and error is : ", error)
                return res.status(201).json({
                    success: false,
                    error
                })
            }
        }
    }
}

// delete Dream
const deleteDream = async (req, res) => {
    const {
        id
    } = req.params;
    try {
            const deletedDream = await Dreams.findByIdAndDelete(id);
            await SubCategories.findByIdAndUpdate(deletedDream.parent, {
                $pull: {
                    "dreams": id
                }
            }, {
                new: true
            })
            if (!deletedDream) {
                return res.json({
                    message: '*** Dream Not Found ****',
                });
            } else {
                return res.json({
                    deletedDream,
                    success: true
                });
            }
    } catch (error) {
        console.log("Error in deleteDream and error is : ", error)
        return res.json({
            error,
            success: false
        });
    }
}

// get all Dreams
const getAllDreams = async (req, res) => {
    try {
        const allDreams = await Dreams.find({})
        if (!allDreams) {
            return res.json({
                message: '*** No Dream Found ****',
            });
        } else {
            return res.json({
                allDreams,
                success: true
            });
        }
    } catch (error) {
        console.log("Error in getAllDreams and error is : ", error)
        return res.json({
                error,
                success: false
            });
    }
}

// get Single Dream
const getSingleDream = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const singleDream = await Dreams.aggregate([
            {
                $match: {
                    _id : mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'dreamappsubcates',
                    localField: 'parent',
                    foreignField: '_id',
                    as: 'parent'
                },
            },
        ])
        if (!singleDream) {
            return res.json({
                message: '*** No Dream Found ****',
                success: false
            });
        } else {
            return res.json({
                singleDream,
                success : true,
            });
        }
    } catch (error) {
        console.log("Error in getSingleDream and error is : ", error)
        return res.json({
                error,
                success : false,
            });
        }
}

// get all Agencies Count
const getAllMemberCount = async (req, res) => {
    try {
        const count = await Users.find({}).count();
        if (!count) {
            return res.json({
                message: '*** No Users Found ****',
            });
        } else {
            return res.json({
                count,
                success: true
            });
        }
    } catch (error) {
        console.log("Error in getAllMemberCount and error is : ", error)
        return res.json({
                error,
                success: false
            });
    }
}

module.exports = {
    addNewDream,
    updateDream,
    getAllDreams,
    getSingleDream,
    deleteDream,
    // getAllMemberCount
}