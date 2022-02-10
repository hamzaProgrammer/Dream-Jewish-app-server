const express = require('express');
const router = express.Router();
const {
    addNewMainCate,
    getSingleAlphabet,
    getAllMainCate,
    getAllMainCateCount,
    updateCate,
    deleteMainCate
} = require('../controllers/MainCateController')


// adding New cate
router.post('/api/mainCate/addNew', addNewMainCate)

// getting Single cate
router.get('/api/mainCate/getSingle/:id', getSingleAlphabet)

// getting all cate
router.get('/api/mainCate/getAll', getAllMainCate)

// get all cate Count
router.get('/api/mainCate/getAll/count', getAllMainCateCount)

// updating main category
router.put('/api/mainCate/update/:id', updateCate);



// Delete Admin
router.delete('/api/mainCate/deleteCate/:id', deleteMainCate)

// // get all admins
// // router.post('/api/cutomer/checkEmailExists', sendMail)


module.exports = router;