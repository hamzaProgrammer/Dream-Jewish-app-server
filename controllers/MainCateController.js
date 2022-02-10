const MainCategories = require('../models/MainCateSchema')
const mongoose = require("mongoose")

// adding new category
const addNewMainCate = async (req, res) => {
    const {alphabet} = req.body;

    let Atype = "string"
    if (!alphabet) {
        return res.json({
            success: false,
            message: "Please Provide Alphabet of Category"
        });
    } else {
        if (alphabet.length > 1){
            res.status(501).json({
                success: false,
                message : "Length of Alphabet Can Not be  Greater than 1"
            })
        }

        if (typeof(alphabet) !==  Atype) {
            res.status(501).json({
                success: false,
                message: "Type Alphabet Can Only Be String"
            })
        }

        const check = await MainCategories.find({
            alphabet: alphabet
        })
        if (check.length > 0) {
            return res.json({
                success: false,
                message: 'Alphabet Already Exists'
            })
        } else {
            const newCategory = new MainCategories({
                ...req.body
            })
            try {
                const addedCategory = await newCategory.save();

                res.status(201).json({
                    addedCategory,
                    success: true
                })
            } catch (error) {
                console.log("Error in addNewMainCate and error is : ", error)
                res.status(201).json({
                    error,
                    success: false
                })
            }
        }
    }
}

// uodate category
const updateCate = async (req, res) => {
    const {
        id
    } = req.params
    if (!id) {
        return res.status(201).json({
            message: '*** Id is Required for Updation ****'
        })
    } else {
        const isExist = await MainCategories.findById(id)
        if (!isExist) {
            return res.status(201).json({
                success: false,
                message: '*** Category Id is Incorrect ****'
            })
        } else {
            try {
                const updatedCate = await MainCategories.findByIdAndUpdate(id, {
                    $set: req.body
                }, {
                    new: true
                })
                res.status(201).json({
                    updatedCate,
                    success: true
                })

            } catch (error) {
                console.log("Error in updateCate and error is : ", error)
                return res.status(201).json({
                    success: false,
                    error
                })
            }
        }
    }
}

// delete main category
const deleteMainCate = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const gotUser = await MainCategories.findById(id);
        if (!gotUser) {
            return res.status(201).json({
                message: "*** No category Found  ***"
            })
        } else {
            if(gotUser.subCate.length > 0){
                return res.json({
                    message: '*** This Category can not be deleted as it contains some sub categories associated wuth this. ****',
                }); 
            }

            const deletedCateg = await MainCategories.findByIdAndDelete(id);
            if (!deletedCateg) {
                return res.json({
                    message: '*** Users Not Found ****',
                });
            } else {
                return res.json({
                    deletedCateg,
                    success: true
                });
            }
        }
    } catch (error) {
        console.log("Error in deleteMainCate and error is : ", error)
         return res.json({
             error,
             success: false
         });
    }
}

// get all Main Categories
const getAllMainCate = async (req, res) => {
    try {
        const allMainCategies = await MainCategories.aggregate([
            {
                $lookup: {
                    from: 'dreamappsubcate',
                    localField: 'subCate',
                    foreignField: '_id',
                    as: 'Sub Categories'
                },
            },
            {
                $lookup: {
                    from: 'dreamappdreams',
                    localField: 'dreams',
                    foreignField: '_id',
                    as: 'Dreams'
                },
            },
        ])
        if (!allMainCategies) {
            return res.json({
                sucess: false,
                message: '*** No Main Category Found ****',
            });
        } else {
            return res.json({
                allMainCategies,
                sucess: true,
            });
        }
    } catch (error) {
        console.log("Error in getAllMainCate and error is : ", error)
        return res.json({
            error,
            sucess: false,
        });
    }
}

// get Single Alphabet
const getSingleAlphabet = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const singleMainCate = await MainCategories.aggregate([
            {
                $match: {
                    _id : mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'dreamappsubcates',
                    localField: 'subCate',
                    foreignField: '_id',
                    as: 'SubCate'
                },
            },
        ])

        if (!singleMainCate) {
            return res.json({
                success: false,
                message: '*** No Main Catgeory Found ****',
            });
        } else {
            return res.json({
                singleMainCate,
                success : true,
            });
        }
    } catch (error) {
        console.log("Error in getSingleAlphabet and error is : ", error)
        return res.json({
            error,
            success: false,
        });
    }
}

// get all Main Cate Count
const getAllMainCateCount = async (req, res) => {
    try {
        const count = await MainCategories.find({}).count();
        if (!count) {
            return res.json({
                message: '*** No Main category Found ****',
            });
        } else {
            return res.json({
                count,
                success: true
            });
        }
    } catch (error) {
        console.log("Error in getAllMainCateCount and error is : ", error)
        return res.json({
            error,
            success: true
        });
    }
}

module.exports = {
    addNewMainCate,
    updateCate,
    getAllMainCate,
    getSingleAlphabet,
    getAllMainCateCount,
    deleteMainCate,
}