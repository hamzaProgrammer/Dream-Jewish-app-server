const SubCategories = require('../models/SubCateSchema')
const MainCategories = require('../models/MainCateSchema')
const mongoose = require("mongoose")

// adding new Sub category
const addNewSubCate = async (req, res) => {
    const {title , parentId} = req.body;
    if (!title || !parentId) {
        return res.json({
            message: "Please Provide All credietials"
        });
    } else {
        const check = await SubCategories.find({
            title: title
        })
        if (check.length > 0) {
            return res.json({
                message: '*** Title Already Exists ***'
            })
        } else {
            req.body.parentId = parentId
            const newCategory = new SubCategories({
                ...req.body
            })
            try {
                const addedCategory = await newCategory.save();

                // adding newly created sub category into main
                await MainCategories.findByIdAndUpdate(parentId , {$push : {subCate : addedCategory._id }} , {new : true})

                res.status(201).json({
                    addedCategory,
                    success: true,
                })
            } catch (error) {
                console.log("Error in addNewSubCate and error is : ", error)
                res.status(404).json({
                    error,
                    success: false,
                })
            }
        }
    }
}

// uodate Sub cate
const updateSubCate = async (req, res) => {
    const {
        id
    } = req.params
    if (!id) {
        return res.status(201).json({
            message: '*** Id is Required for Updation ****'
        })
    } else {
        const isExist = await Users.findById(id)
        if (!isExist) {
            return res.status(201).json({
                success: false,
                message: 'Users Id is Incorrect'
            })
        } else {
            isExist.title = req.body
            try {
                const updatedUser = await Users.findByIdAndUpdate(id, {
                    $set: {...isExist}
                }, {
                    new: true
                })
                res.status(201).json({
                    updatedUser,
                    success: true
                })

            } catch (error) {
                console.log("Error in updateSubCate and error is : ", error)
                return res.status(201).json({
                    success : false,
                    error
                })
            }
        }
    }
}

// delete Sub cate
const deleteSubCate = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const gotSubcate = await SubCategories.findById(id);
        if (!gotSubcate) {
            return res.status(201).json({
                message: "*** No User Found  ***"
            })
        } else {
           if(gotSubcate.dreams.length > 0){
               return res.json({
                   success: false,
                    message: '*** This Category can not be deletedd as it has some dreams associated with this ****',
                });
           }

            const deletedSubCate = await SubCategories.findByIdAndDelete(id)
            if (!deletedSubCate) {
                return res.json({
                    success: false,
                    message: 'SUb Category Not Found',
                });
            } else {
                return res.json({
                    success: true,
                    message: '*** Category SuccessFully Deleted ****',
                });
            }
        }
    } catch (error) {
        console.log("Error in deleteSubCate and error is : ", error)
         return res.json({
             success: false,
             error
         });
    }
}

// get all Main Categories
const getAllSubCate = async (req, res) => {
    try {
        const allSubCategies = await SubCategories.aggregate([
            {
                $lookup: {
                    from: 'dreamappdreams',
                    localField: 'dreams',
                    foreignField: '_id',
                    as: 'Dreams'
                },
            },
        ])
        if (!allSubCategies) {
            return res.json({
                success: false,
                message: 'No Main Category Found',
            });
        } else {
            return res.json({
                allSubCategies,
                success: true,
            });
        }
    } catch (error) {
        console.log("Error in getAllSubCate and error is : ", error)
         return res.json({
             error,
             success: false,
         });
    }
}

// get all Main Categories fro admin
const getAllSubCateForAdmin = async (req, res) => {
    try {
        const allSubCategies = await SubCategories.aggregate([
            {
                $lookup: {
                    from: 'dreamappdreams',
                    localField: 'dreams',
                    foreignField: '_id',
                    as: 'Dreams'
                },
            },
            {
                $lookup: {
                    from: 'dreamappmaincates',
                    localField: 'parentId',
                    foreignField: '_id',
                    as: 'Dreams'
                },
            },
        ])
        if (!allSubCategies) {
            return res.json({
                success: false,
                message: 'No Main Category Found',
            });
        } else {
            return res.json({
                allSubCategies,
                success: true,
            });
        }
    } catch (error) {
        console.log("Error in getAllSubCate and error is : ", error)
         return res.json({
             error,
             success: false,
         });
    }
}

// get Single Sub category
const getSingleSubCate = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const singleSubCate = await SubCategories.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'dreamappdreams',
                    localField: 'dreams',
                    foreignField: '_id',
                    as: 'dreams'
                },
            },
            {
                $lookup: {
                    from: 'dreamappmaincates',
                    localField: 'parentId',
                    foreignField: '_id',
                    as: 'parentId'
                },
            },
        ]);

        if (!singleSubCate) {
            return res.json({
                success: false,
            });
        } else {
            return res.json({
                singleSubCate,
                success: true,
            });
        }
    } catch (error) {
        console.log("Error in getSingleSubCate and error is : ", error)
        return res.json({
            error,
            success: false,
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
                message: '*** Got Result ****',
            });
        }
    } catch (error) {
        console.log("Error in getAllMemberCount and error is : ", error)
    }
}

module.exports = {
    addNewSubCate,
    updateSubCate,
    getAllSubCate,
    getSingleSubCate,
    deleteSubCate,
    getAllSubCateForAdmin,
    // getAllMemberCount
}