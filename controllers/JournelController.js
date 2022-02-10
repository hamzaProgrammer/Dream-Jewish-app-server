const Journels = require('../models/JournelSchema')
const SubCategories = require('../models/SubCateSchema')
const mongoose = require("mongoose")

// adding new Journel
const addNewJournel = async (req, res) => {
    const {title , dreamType , desc  , datePost ,  timePost , dreamTime , mood ,searchDate } = req.body;

    if (!title || !dreamType || !desc || !mood || !timePost || !dreamTime || !datePost || !searchDate) {
        return res.json({
            message: "Please Provide All Credientials"
        });
    } else {
        const check = await Journels.find({
            title: title
        })
        if (check.length > 0) {
            return res.json({
                message: '*** Title Already Exists ***'
            })
        } else {
            const newJournel = new Journels({
                ...req.body,
            })

            console.log("newJournel : ", newJournel);
            try {
                const addedJournel = await newJournel.save();

                res.status(201).json({
                    addedJournel,
                    success: true
                })
            } catch (error) {
                console.log("Error in addNewJournel and error is : ", error)
                res.status(201).json({
                    error,
                    success: false
                })
            }
        }
    }
}

// uodate Journel
const updateJournel = async (req, res) => {
    const {
        id, user
    } = req.params
    if (!id) {
        return res.status(201).json({
            success: false,
            message: 'Hournel Id is Required for Updation'
        })
    } else {
        const isExist = await Journels.findOne({_id : id , user : user})
        if (!isExist) {
            return res.status(201).json({
                success: false,
                message: 'Journel Id or User Id is Incorrect'
            })
        } else {
            try {
                const updatedJournel = await Journels.findByIdAndUpdate(id, {
                    $set: req.body
                }, {
                    new: true
                })
                res.status(201).json({
                    updatedJournel,
                    success: true
                })

            } catch (error) {
                console.log("Error in updateJournel and error is : ", error)
                return res.status(201).json({
                   sucess: false,
                    message : "Oops! Some may have occured, Please Try again. Thanks"
                })
            }
        }
    }
}

// delete Member
const deleteMember = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const gotUser = await Users.findById(id);
        if (!gotUser) {
            return res.status(201).json({
                message: "*** No User Found  ***"
            })
        } else {
            let gotSubs;
            let cDate = new Date();
            gotSubs = await Subscriptions.find({
                member: gotUser._id
            })
            let index = false;
            gotSubs[0].cashRegister.map((x, ind) => {
                if (x.dateOfCollection >= cDate) {
                    if (index === false) {
                        index = true
                    }
                    if (x.dateOfCollection === cDate && x.status === "Collected") {
                        index = false;
                    }
                }
            })

            if (index === true) {
                return res.status(201).json({
                    success: false,
                    message: "*** Sorry! Member can not be Deleted as it has to Pay for Any Running Subcription. Thanks ***"
                })
            }

            const deletedUsers = await Users.findByIdAndDelete(id);
            // removing Users from  agency's Users array
            await Agencies.find({
                _id: deletedUsers.agency
            })
            await Agencies.findByIdAndUpdate(deletedUsers.agency, {
                $pull: {
                    "Users": id
                }
            }, {
                new: true
            })

            // removing Users from  Operator's Users array
            await Operators.find({
                _id: deletedUsers.operator
            })
            await Operators.findByIdAndUpdate(deletedUsers.operator, {
                $pull: {
                    "Users": id
                }
            }, {
                new: true
            })
            if (!deletedUsers) {
                return res.json({
                    message: '*** Users Not Found ****',
                });
            } else {
                return res.json({
                    deletedUsers,
                    success: true
                });
            }
        }
    } catch (error) {
        console.log("Error in deleteMember and error is : ", error)
        return res.json({
                    error,
                    success: false
                });
    }
}

// get all Journels
const getAllJournels = async (req, res) => {
    const {id} = req.params;
    try {
        const allJournels = await Journels.aggregate([
            {
                $match : {
                    user : mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'dreamappsubcates',
                    localField: 'parentCate',
                    foreignField: '_id',
                    as: 'Parent Category'
                },
            },
        ])
        if (!allJournels) {
            return res.json({
                success: false,
                message: '*** No Journel Found ****',
            });
        } else {
            return res.json({
                allJournels,
                success: true
            });
        }
    } catch (error) {
        console.log("Error in getAllJournels and error is : ", error)
         return res.json({
             error,
             success: true
         });
    }
}

// get Single Journel
const getSingleJournel = async (req, res) => {
    const {
        id
    } = req.params;

    try {
        const singleJournel = await Journels.aggregate([
            {
                $match: {
                     _id: mongoose.Types.ObjectId(id)
                },
            },
            {
                $lookup: {
                    from: 'dreamappsubcates',
                    localField: 'parentCate',
                    foreignField: '_id',
                    as: 'Parent Category'
                },
            },
        ]);

        if (!singleJournel) {
            return res.json({
                success: false,
                message: '*** No Main Catgeory Found ****',
            });
        } else {
            return res.json({
                singleJournel,
                success: true
            });
        }
    } catch (error) {
        console.log("Error in getSingleJournel and error is : ", error)
        return res.json({
            error,
            success: false
        });
    }
}

// get date wise Journels
const getJournelsByDate = async (req, res) => {
    const {
        date,
        id
    } = req.params;

    try {
        const allJournels = await Journels.aggregate([
            {
                $match: {
                    searchDate: date,
                    user: mongoose.Types.ObjectId(id)
                },
            },
        ]);

        if (!allJournels) {
            return res.json({
                success: false,
                message: '*** No Journels Found ****',
            });
        } else {
            return res.json({
                allJournels,
                success: true,
            });
        }
    } catch (error) {
        console.log("Error in getJournelsByDate and error is : ", error)
        return res.json({
            error,
            success: false,
        });
    }
}

// get dream type  Journels
const getJournelsByDreamType = async (req, res) => {
    const {
        type,
        id
    } = req.params;

    try {
        const allJournels = await Journels.aggregate([
            {
                $match: {
                      dreamType: type,
                      user: mongoose.Types.ObjectId(id)
                },
            },
            {
                $lookup: {
                    from: 'dreamappsubcates',
                    localField: 'parentCate',
                    foreignField: '_id',
                    as: 'Parent Category'
                },
            },
        ]);

        if (!allJournels) {
            return res.json({
                success: false,
                message: '*** No Journels Found ****',
            });
        } else {
            return res.json({
                allJournels,
                success: true
            });
        }
    } catch (error) {
        console.log("Error in getJournelsByDreamType and error is : ", error)
        return res.json({
            allJournels,
            success: false
        });
    }
}

// get by moods + quality + clarity  Journels
const getJournelsByThreefactors = async (req, res) => {
    const {data , id} = req.body;

    try {
        const allJournels = await Journels.aggregate([
            {
                $match: {
                       $and :  [ {mood: {$in : data}} , {quality: {$in : data}} , {clearity: {$in : data}} ],
                       //$and :  [ {mood : data} , {quality: data} , {clearity: data} ],
                       user: mongoose.Types.ObjectId(id)
                },
            },
        ]);

        if (!allJournels) {
            return res.json({
                success: false,
                message: '*** No Journels Found ****',
            });
        } else {
            return res.json({
                allJournels,
                success: true,
            });
        }
    } catch (error) {
        console.log("Error in getJournelsByThreefactors and error is : ", error)
        return res.json({
            error,
            success: false,
        });
    }
}

// Delete Journel
const deleteJournel = async (req, res) => {
    const {
        id, userId
    } = req.params;
    try {
        const delJournel = await Journels.findOneAndDelete({_id : id , user : userId})

        if (!delJournel) {
            return res.json({
                message: '*** No Journel Found ****',
            });
        } else {
            return res.json({
                delJournel,
                success: true,
            });
        }
    } catch (error) {
        console.log("Error in deleteJournel and error is : ", error)
         return res.json({
             error,
             success: false,
         });
    }
}

// get all Journels Count
const getAllJournelsCount = async (req, res) => {
    const {id } = req.params;
    try {
        const count = await Journels.find({
            user: id ,
        }).count();
            return res.json({
                count,
                success: true,
            });
    } catch (error) {
        console.log("Error in getAllJournelsCount and error is : ", error)
        return res.json({
            error,
            success: false,
        });
    }
}


const getAlldreamTypeCount = async (req, res) => {
    const {id , type } = req.params;

    // curent date
    const curentDate = new Date();
    let ccurntGotDate = curentDate.getFullYear() + "-" + (curentDate.getMonth() + 1) + "-" + ( curentDate.getDate() + 1 );
    let sendingDate = curentDate.getFullYear() + "-" + (curentDate.getMonth() + 1) + "-" + curentDate.getDate();

    // got date
    const newGotDate = new Date()
    let gotMonth = newGotDate.getMonth() + 1;
    let gotYear = newGotDate.getFullYear();
    let gotDay = newGotDate.getDate();

    let diff = 0;
    let newDiff = 0;
    if(type === "7Days"){
        let diff = gotDay - 7;
        newDiff = diff;
        if (diff < 0) {
            diff = -diff;
            //  checking last date of month to subtract
            if (gotMonth === 0 || gotMonth === 2 || gotMonth === 4 || gotMonth === 6 || gotMonth === 7 || gotMonth === 9 || gotMonth === 11) {
                newDiff = 31 - diff;
            }
            if (gotMonth === 3 || gotMonth === 5 || gotMonth === 8 || gotMonth === 10 ) {
                newDiff = 30 - diff;
            }
            if (gotMonth === 1) {
                newDiff = 28 - diff;
            }

            if (newGotDate.getMonth() === 0){
                newGotDate.setMonth(11)
                newGotDate.setFullYear(newGotDate.getFullYear() - 1);
                gotYear = newGotDate.getFullYear();
                gotMonth = newGotDate.getMonth()
            }else{
                console.log("Inner inner")
                newGotDate.setMonth(newGotDate.getMonth())
                gotMonth = newGotDate.getMonth()
            }
        }
    }
    if (type === "15Days") {
        let diff = gotDay - 15;
        newDiff = diff;
        if (diff < 0) {
            diff = -diff;
            //  checking last date of month to subtract
            if (gotMonth === 0 || gotMonth === 2 || gotMonth === 4 || gotMonth === 6 || gotMonth === 7 || gotMonth === 9 || gotMonth === 11) {
                newDiff = 31 - diff;
            }
            if (gotMonth === 3 || gotMonth === 5 || gotMonth === 8 || gotMonth === 10) {
                newDiff = 30 - diff;
            }
            if (gotMonth === 1) {
                newDiff = 28 - diff;
            }

            if (newGotDate.getMonth() === 0) {
                newGotDate.setMonth(11)
                newGotDate.setFullYear(newGotDate.getFullYear() - 1);
                gotYear = newGotDate.getFullYear();
                gotMonth = newGotDate.getMonth()
            } else {
                console.log("Inner inner")
                newGotDate.setMonth(newGotDate.getMonth())
                gotMonth = newGotDate.getMonth()
            }
        }
    }
    if (type === "30Days") {
        let diff = gotDay - 30;
        newDiff = diff;
        if (diff < 0) {
            diff = -diff;
            //  checking last date of month to subtract
            if (gotMonth === 0 || gotMonth === 2 || gotMonth === 4 || gotMonth === 6 || gotMonth === 7 || gotMonth === 9 || gotMonth === 11) {
                newDiff = 31 - diff;
            }
            if (gotMonth === 3 || gotMonth === 5 || gotMonth === 8 || gotMonth === 10) {
                newDiff = 30 - diff;
            }
            if (gotMonth === 1) {
                newDiff = 28 - diff;
            }

            if(newDiff === 0 ){
                newDiff = 1;
            }
            if (newGotDate.getMonth() === 0) {
                newGotDate.setMonth(11)
                newGotDate.setFullYear(newGotDate.getFullYear() - 1);
                gotYear = newGotDate.getFullYear();
                gotMonth = newGotDate.getMonth()
            } else {
                console.log("Inner inner")
                newGotDate.setMonth(newGotDate.getMonth())
                gotMonth = newGotDate.getMonth()
            }
        }
    }
    // setting date to previous one
    newGotDate.setDate(newDiff)

    let finalGotDate = gotYear + "-" + gotMonth + "-" + ( newDiff + 1 ) ;
    console.log("Udates : ", "finalGotDate : " , finalGotDate, "ccurntGotDate : ", ccurntGotDate)
    console.log("-------------------------")

    let message = `Record shown is from ${gotYear}-${gotMonth}-${newDiff + 1} to ${sendingDate} and having differnce of ${type}.`;

    let totLucid = 0 , totNightmare = 0, totRecurring = 0 , totDreams = 0;
    let allLucidsDreams , allRecuringDreams , allNightmare = {};
    console.log("finalGotDate : ", new Date(finalGotDate), "ccurntGotDate : ", new Date(ccurntGotDate))

    try {
            totLucid = await Journels.find({
                datePost: {
                    $gte: new Date(finalGotDate),
                    $lte: new Date(ccurntGotDate)
                },
                user: id, dreamType: "Lucid",
            }).count();

            totNightmare = await Journels.find({user: id , dreamType : "Nightmare",
                 datePost: {
                     $gte: new Date(finalGotDate),
                     $lte: new Date(ccurntGotDate)
                 },
            }).count();

            totRecurring = await Journels.find({user: id , dreamType : "Recurring",
                 datePost: {
                     $gte: new Date(finalGotDate),
                     $lte: new Date(ccurntGotDate)
                 },
            }).count();

            // Dreams all

            allLucidsDreams = await Journels.find({
                        user: id,
                        dreamType: "Lucid",
                 datePost: {
                     $gte: new Date(finalGotDate),
                     $lte: new Date(ccurntGotDate)
                 },
            } , {_id : 0 , title : 1 , datePost : 1});

            allNightmare = await Journels.find({
                        user: id,
                        dreamType: "Nightmare",
                 datePost: {
                     $gte: new Date(finalGotDate),
                     $lte: new Date(ccurntGotDate)
                 },
            } , {_id : 0 , title : 1 , datePost : 1})

            allRecuringDreams = await Journels.find({
                        user: id,
                        dreamType: "Recurring",
                 datePost: {
                     $gte: new Date(finalGotDate),
                     $lte: new Date(ccurntGotDate)
                 },
            } , {_id : 0 , title : 1 , datePost : 1})

            totDreams = totLucid + totNightmare + totRecurring
        return res.json({
            totDreams,
            totLucid,
            totNightmare,
            totRecurring,
            allLucidsDreams,
            allRecuringDreams,
            allNightmare,
            message,
            success: true,
        });
    } catch (error) {
        console.log("Error in getAlldreamTypeCount and error is : ", error)
        return res.json({
            error,
            success: true,
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
    addNewJournel,
    updateJournel,
    getAllJournels,
    getSingleJournel,
    deleteJournel,
    getJournelsByDate,
    getJournelsByDreamType,
    getJournelsByThreefactors,
    getAllJournelsCount,
    getAlldreamTypeCount,
    // deleteMember,
    // getAllMemberCount
}