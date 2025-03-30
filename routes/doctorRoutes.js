const express = require('express');
const {
    getDoctorInfoController,
    updateProfileController,
    bookAppointmentController,
    getDoctorByIdController,
    doctorAppointmentsController,
    updateStatusController,
} = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();


router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);
router.post('/updateProfile', authMiddleware, updateProfileController);
router.post('/book-appointment', authMiddleware, bookAppointmentController);

router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController);

router.post('/update-status', authMiddleware, updateStatusController);

module.exports = router;