const Users = require('../models/UserSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const nodeMailer = require("nodemailer");
const stripe = require('stripe')(process.env.Stripe_Secret_key)
const uuid = require("uuid"); // avoid double payment charge from customer for same order



// Sign Up new User
const addNewUser = async (req, res) => {
    const { username, email , password , } = req.body;
    if (!username || !email || !password ) {
        return res.json({
            message: "Please fill All required credentials"
        });
    } else {
        const check = await Users.find({
            email: email
        })
        if (check.length > 0) {
            return res.json({
                message: '*** User Already Exists ***'
            })
        } else {
                req.body.password = await bcrypt.hash(password, 10); // hashing password
                const newUser = new Users({...req.body})
                try {
                    const addedUser = await newUser.save();

                    res.status(201).json({
                        addedUser,
                        success: true
                    })
                } catch (error) {
                    console.log("Error in addNewUser and error is : ", error)
                     res.status(201).json({
                         error,
                         success: true
                     })
                }
        }
    }
}

// Logging In User
const LogInUser = async (req, res) => {
    const { email ,  password } = req.body

        if(!email  || !password){
            return res.json({mesage : "**** Please fill Required Credientials ***"})
        }else {
            try {
                const isOprExists = await Users.findOne({email: email});

                if(!isOprExists){
                    return res.json({ message: "*** User Not Found ***"})
                }
                    const isPasswordCorrect = await bcrypt.compare(password, isOprExists.password); // comparing password
                    if (!isPasswordCorrect) {
                        return res.json({
                            message: '*** Invalid Credientials ***'
                        })
                    }

                    const token = jwt.sign({id: isOprExists._id} , JWT_SECRET_KEY , {expiresIn: '24h'}); // gentating token

                    return res.json({
                        myResult: isOprExists,
                        success : true,
                        token
                    });
            } catch (error) {
                console.log("Error in LogInUser and error is : ", error)
                return res.json({
                    error,
                    success: false
                });
            }
        }

}

// sending mails
const sendMail = async(req,res) => {
    const {email} = req.params;
    const data = await Users.find({email: email});
    if(data){
        const curntDateTime = new Date();
        let randomNo = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        await Users.findOneAndUpdate({email : email}, { $set: {...data ,  codeSentTime : curntDateTime , otpCode : randomNo } }, {new: true })

        // step 01
        const transport= nodeMailer.createTransport({
            service : "gmail",
            auth: {
                user : process.env.myEmail, //own eamil
                pass: process.env.myPassword, // own password
            }
        })
        // setp 02
        const mailOption = {
            from: process.env.myEmail, // sender/own eamil
            to: email, // reciver eamil
            subject: "Secret Code Changing in Dream App Password",
            text : `Dear Member , Your Secret Code is ${randomNo}. This will expire in next 60 seconds .`
        }
        // step 03
        transport.sendMail(mailOption, (err, info) => {
            if (err) {
                console.log("Error occured : ", err)
                return res.json({ success: false, mesage : " Error in sending mail" , err})
            } else {
                console.log("Email Sent and info is : ", info.response)
                return res.json({success: true,  message: 'Email Sent SuccessFully' })
            }
        })
        
    }else{
        return res.json({ success : true})
    }
}

// Checking OtpCode
const checkOtpCode = async (req, res) => {
    const {email} = req.params;
    const data = await Users.find({email : email});

    const {otpCode } = req.body;
    if(data[0].codeSentTime === null){
        return res.status(201).json({message: '***  You have not sent any code yet. ***'})
    }
    if (data){
        let curntDateTime = new Date();
        let diff = new Date(curntDateTime.getTime() - data[0].codeSentTime.getTime()) / 1000; //  getting time diff in seconds
        parseInt(diff)
        if (diff < 60) {  // checking if sent time is less than 60 seconds
                try{
                    if(otpCode == data[0].otpCode){
                        const update = await Users.findOneAndUpdate({email: email}  ,{ $set: { ...data.body , codeSentTime : null , otpCode : null }} , {new: true} )

                        if(update){
                            return res.status(201).json({update , success: true})
                        }
                    }else{
                        return res.status(201).json({ success: false , message: 'InValid Token'})
                    }
                }catch (error) {
                    console.log("Error is :", error)
                    return res.status(201).json({success: false,  message: '!!! Opps An Error Occured !!!' , error})
                }
            }else{
                return res.status(201).json({ success: false, message: '!!! Time for Your Token Expired !!!' })
            }
        }else{
            return res.status(201).json({success: false ,  message: '!!! InValid Credinatials !!!' })
        }
}

// uodate Member  password only
const updateUserPass = async (req, res) => {
    const {
        email
    } = req.params
    if (!email) {
        return res.status(201).json({
            message: '*** Email is Required for Updation ****'
        })
    } else {
        const isExist = await Users.findOne({
            email: email
        })
        if (!isExist) {
            return res.status(201).json({
                success: false,
                message: 'Email is Incorrect'
            })
        } else {
            try {
                if (req.body.password) {
                    req.body.password = await bcrypt.hash(req.body.password, 10); // hashing password
                }

                const updatedUser = await Users.findOneAndUpdate({
                    email: email
                }, {
                    $set: req.body
                }, {
                    new: true
                })

                res.status(201).json({
                    updatedUser,
                    success: true,
                })
            } catch (error) {
                console.log("Error in updateUserPass and error is : ", error)
                return res.status(201).json({
                    success: false,
                    error
                })
            }
        }
    }
}

// uodate Users Info Only
const updateUser = async (req, res) => {
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
                message: '*** Users Id is Incorrect ****'
            })
        } else {
            try {
                const updatedUser = await Users.findByIdAndUpdate(id, {
                    $set: req.body
                }, {
                    new: true
                })
                res.status(201).json({
                    updatedUser,
                    success: true
                })

            } catch (error) {
                console.log("Error in updateUser and error is : ", error)
                return res.status(201).json({
                    success: false,
                    error
                })
            }
        }
    }
}

// uodate Admin
const updateAdmin = async (req, res) => {
    const {
        id
    } = req.params
    if (!id) {
        return res.status(201).json({
            message: '*** Id is Required for Updation ****'
        })
    } else {
        let isExist = await Users.findById(id)
        if (!isExist) {
            return res.status(201).json({
                message: '*** Users Id is Incorrect ****'
            })
        } else {
            try {
                isExist.email = req.body.email;
                console.log("isExist.email : ", isExist.email)
                if (req.body.password !== "") {
                    isExist.password = await bcrypt.hash(req.body.password, 10); // hashing password
                }
                const updatedUser = await Users.findByIdAndUpdate(id, {
                    $set: {...isExist}
                }, {
                    new: true
                })
                console.log(updatedUser)
                res.status(201).json({
                    updatedUser,
                    success: true
                })

            } catch (error) {
                console.log("Error in updateUser and error is : ", error)
                return res.status(201).json({
                    success: false,
                    error
                })
            }
        }
    }
}


// Stripe Payments
const makeStripePayment = async (req,res) => {
    const {title , desc  , cardNumber, expMM, expYY, cvv , email , name , amount} = req.body;

    const createdUser = await stripe.customers.create({
        email: email || 'testUser@gmail.com',
        name: name || "123"
    })

    //console.log("createdUser", createdUser)
    if (createdUser)
    {
        try {
            const token = await stripe.tokens.create({ card: {
                number: cardNumber, exp_month: expMM, exp_year: expYY, cvc: cvv } })
           //console.log("token : ", token)
            const AddingCardToUser = await stripe.customers.createSource(createdUser.id, { source: token.id })
            //console.log("AddingCardToUser : ", AddingCardToUser)

            const charge = await stripe.charges.create({
                amount: amount * 100,
                description: 'Dream App Service Charges',
                currency: 'USD',
                customer: createdUser.id,
                //card: token.id
            })
            //console.log("SuccessFull Charged : ", charge)
            // const invoice = await stripe.invoices.sendInvoice(charge.id);
            // console.log("invoice", invoice)

            // sending mail to Admin

            // step 01
            const transport = nodeMailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.myEmail, //own eamil
                    pass: process.env.myPassword, // own password
                }
            })
            // setp 02
            const mailOption = {
                from: process.env.myEmail, // sender/own eamil
                to: "dreamapp2001@gmail.com", // reciver/admin eamil
                subject: "!! Dream App !! Request of User for his/her dream.",
                text: `Dear Admin ,a user having email (${email}) has a dream.\n Title of his dream is (${title}) and description is (${desc}).\n User also has transferred Amount of $(${amount}).\n Please have a look on his dream and reply him at (${email}).\n Thanks.`
            }
            // step 03
            transport.sendMail(mailOption, (err, info) => {
                if (err) {
                    console.log("Error occured : ", err)
                    return res.json({
                        mesage: "Error in sending mail",
                        err,
                        sucess: false
                    })
                } else {
                    console.log("Email Sent to Admin SuccessFully ", info.response )
                }
            })

            // sending mail to User

            // setp 02
            const mailOptionOne = {
                from: process.env.myEmail, // sender/own eamil
                to: email, // reciver/admin eamil
                subject: "!! Dream App !! Request for Expert Interpretation",
                text: `Dear Member , We have recived your mail and Our Expert Will Respond you.\n You have transferred Amount of $(${amount}) to us and we will response you back soon.\n Thanks.`
            }
            // step 03
            transport.sendMail(mailOptionOne, (err, info) => {
                if (err) {
                    console.log("Error occured : ", err)
                    return res.json({
                        mesage: "Error in sending mail",
                        err,
                        sucess: false
                    })
                } else {
                    console.log("Email Sent to User SuccessFully : ", info.response )
                }
            })

        return  res.status(201).json({ success: true, message : "Payment Charged Successfully and also a mail has been sent to Admin as well as to User"}) ;
        } catch (error) {
            switch (error.type) {
                case 'StripeCardError':
                    // A declined card error
                    console.log(`Error in ${error.type} and error is : `, error.message)
                    error.message; // => e.g. "Your card's expiration year is invalid."
                    break;
                case 'StripeInvalidRequestError':
                    console.log(`Error in ${error.type} and error is : `, error.message)
                    // Invalid parameters were supplied to Stripe's API
                    break;
                case 'StripeAPIError':
                    console.log(`Error in ${error.type} and error is : `, error.message)
                    // An error occurred internally with Stripe's API
                    break;
                case 'StripeConnectionError':
                    console.log(`Error in ${error.type} and error is : `, error.message)
                    // Some kind of error occurred during the HTTPS communication
                    break;
                case 'StripeAuthenticationError':
                    console.log(`Error in ${error.type} and error is : `, error.message)
                    // You probably used an incorrect API key
                    break;
                case 'StripeRateLimitError':
                    console.log(`Error in ${error.type} and error is : `, error.message)
                    // Too many requests hit the API too quickly
                    break;
            }
            return res.status(501).json({success: false , message : `Error in ${error.type} and error is :  ${error.message}`})
        }
    }
}

// delete User
const deleteUser = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const gotUser = await Users.findById(id);
        if (!gotUser){
            return res.status(201).json({ success: false , message: "No User Found " })
        }else{
            const deletedUsers = await Users.findByIdAndDelete(id);
            if (!deletedUsers) {
                return res.json({
                    success: false,
                    message: 'Users Not Found',
                });
            } else {
                return res.json({
                    success: true,
                    message: 'Users SuccessFully Deleted',
                });
            }
        }
    } catch (error) {
        console.log("Error in deleteUser and error is : ", error)
        return res.json({
            success: false,
            message: 'Users Not Deleted',
        });
    }
}

// get all Users
const getAllUsers = async (req, res) => {
    try {
        const allUsers = await Users.find({});
        if (!allUsers) {
            return res.json({
                success: false,
                message: 'No Users Found',
            });
        } else {
            return res.json({
                allUsers,
                success: true,
            });
        }
    } catch (error) {
        console.log("Error in getAllUsers and error is : ", error)
    }
}

// get all Recent Users
const getRecentUsers = async (req, res) => {
    try {
        const allUsers = await Users.find({}).limit(4);
        if (!allUsers) {
            return res.json({
                success: false,
                message: 'No Users Found',
            });
        } else {
            return res.json({
                allUsers,
                success: true
            });
        }
    } catch (error) {
        console.log("Error in getRecentUsers and error is : ", error)
        return res.json({
            error,
            success: false
        });
    }
}

// get Single Users
const getSingleUser = async (req, res) => {
    const {id} = req.params;

    try {
        const singleUser = await Users.findById(id)

        if (!singleUser) {
            return res.json({
                success: false,
                message: 'No User Found',
            });
        } else {
            return res.json({
                singleUser,
                success: true
            });
        }
    } catch (error) {
        console.log("Error in getSingleUser and error is : ", error)
         return res.json({
             error,
             success: fasle
         });
    }
}

// get all Users Count
const getAllUsersCount = async (req, res) => {
    try {
        const count = await Users.find({}).count();
        if (!count) {
            return res.json({
                success: true,
                message: 'No Users Found',
            });
        } else {
            return res.json({
                count,
                success: true
            });
        }
    } catch (error) {
        console.log("Error in getAllUsersCount and error is : ", error)
        return res.json({
            error,
            success: false
        });
    }
}

module.exports = {
    addNewUser,
    LogInUser,
    sendMail,
    checkOtpCode,
    updateUserPass,
    updateUser,
    makeStripePayment,
    getAllUsers,
    getSingleUser,
    getRecentUsers,
    deleteUser,
    getAllUsersCount,
    updateAdmin
}