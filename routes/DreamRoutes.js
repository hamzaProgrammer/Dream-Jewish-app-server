const express = require('express');
const router = express.Router();
const {
    addNewDream,
    getAllDreams,
    updateDream,
    getSingleDream,
    deleteDream,
    getSingleUser,
    //getSingleSubCate,
    // getAllMainCate
} = require('../controllers/DreamController')


// adding New cate
router.post('/api/dream/addNew', addNewDream)

// getting SingleDream
router.get('/api/dream/getSingle/:id', getSingleDream)

// getting all dreams
router.get('/api/dream/getAll', getAllDreams)


// updating Dream
router.put('/api/dream/updateDream/:id', updateDream);

// Delete Dream
router.delete('/api/dream/deleteDream/:id', deleteDream)

// // get all admins
// // router.post('/api/cutomer/checkEmailExists', sendMail)


module.exports = router;