const express = require('express');
const router = express.Router();
const {
    addNewUser,
    LogInUser,
    sendMail,
    checkOtpCode,
    updateUserPass,
    updateUser,
    makeStripePayment,
    // updateAdmin,
    deleteUser,
    getAllUsersCount,
    getSingleUser,
    getAllUsers,
    getRecentUsers,
    updateAdmin
} = require('../controllers/UsersControllers')


// Sign Up User
router.post('/api/user/register', addNewUser)

// Sign In User
router.post('/api/user/signin', LogInUser)


// Sending Email
router.put('/api/user/sendMail/:email', sendMail);

// Checking Otp
router.put('/api/user/checkOtp/:email', checkOtpCode);

// Checking Otp
router.put('/api/user/updateAdmin/:id', updateAdmin);


// Updating password
router.put('/api/user/updatePass/:email', updateUserPass);

// Update user info
router.put('/api/user/updateUserInfo/:id', updateUser);

// make stripe payment
router.post('/api/user/makeStipePay', makeStripePayment)

// // updating Admin Account
// router.put('/api/admin/updateAdmin/:id', updateAdmin);

// Delete user
router.delete('/api/user/deleteUser/:id', deleteUser)

// get all users
router.get('/api/user/getAll', getAllUsers)

// get all users recent
router.get('/api/user/getRecentUsers', getRecentUsers)

// get all users Count
router.get('/api/user/getAll/count', getAllUsersCount)

// get single users
router.get('/api/user/getSingle/:id', getSingleUser)


module.exports = router;