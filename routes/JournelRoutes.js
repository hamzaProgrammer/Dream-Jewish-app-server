const express = require('express');
const router = express.Router();
const {
    addNewJournel,
    getAllJournels,
    getSingleJournel,
    deleteJournel,
    getJournelsByDate,
    getJournelsByDreamType,
    getJournelsByThreefactors,
    getAllJournelsCount,
    getAlldreamTypeCount,
    updateJournel,
} = require('../controllers/JournelController')


// adding New Journel
router.post('/api/journel/addNew', addNewJournel)

// getting Single Journel
router.get('/api/journel/getSingle/:id', getSingleJournel)

// getting all journels
router.get('/api/journel/getAll/:id', getAllJournels)

// getting all journels Count
router.get('/api/journel/getAllCount/:id', getAllJournelsCount)

// getting all journels Count By DreamType
router.get('/api/journel/getAllDreamTypeCount/:id/:type', getAlldreamTypeCount)

// getting all journels by date
router.get('/api/journel/getAllByDate/:date/:id', getJournelsByDate)

// getting all journels by Dream Type
router.get('/api/journel/getAllByDreamType/:type/:id', getJournelsByDreamType)

// getting all journels Count
router.post('/api/journel/getAllBymultFactors', getJournelsByThreefactors)


// updating Journel
router.put('/api/journel/updateJournel/:id/:user', updateJournel);

// Delete Journel
router.delete('/api/journel/deleteJournel/:id/:userId', deleteJournel)

// // get all admins
// // router.post('/api/cutomer/checkEmailExists', sendMail)


module.exports = router;