const express = require('express');
const router = express.Router();
const {
    addNewSubCate,
    getSingleSubCate,
    getAllSubCate,
    updateSubCate,
    deleteSubCate,
    getAllSubCateForAdmin
    // getAllMainCate
} = require('../controllers/SubCateController')


// adding New cate
router.post('/api/subCate/addNew', addNewSubCate)

// getting Single sub cate
router.get('/api/subCate/getSingle/:id', getSingleSubCate)

// getting all cate
router.get('/api/subCate/getAll', getAllSubCate)

// getting all cate fro admin
router.get('/api/subCate/getAllForAmdin', getAllSubCateForAdmin)


// updating Admin Account
router.put('/api/subCate/updateSingle/:id', updateSubCate);

// Delete Admin
router.delete('/api/subCate/deleteSubCate/:id', deleteSubCate)

// // get all admins
// // router.post('/api/cutomer/checkEmailExists', sendMail)


module.exports = router;