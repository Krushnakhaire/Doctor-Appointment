// const express=require('express');
// const{
//     loginController,
//     registerController,
//      authController,
//     applyDoctorController,
//     getAllNotificationController,
//     deleteAllNotificationController,
//     getAllDoctorsController
// }=require("../controllers/userCtrl");
//  const authMiddleware=require("../middlewares/authMiddleware");
// const { get } = require('mongoose');
// //const { getAllDoctorsController } = require('../controllers/adminCtrl');
// const router=express.Router();

// //login
// router.post('/login',loginController);
// //register
// router.post('/register',registerController);
// //Auth
// router.post('/getUserData',authMiddleware,authController);

// router.post('/apply-doctor',authMiddleware,applyDoctorController);

// router.post('/get-all-notifications',authMiddleware,getAllNotificationController);

// router.post('/delete-all-notifications',authMiddleware,deleteAllNotificationController);

// //router.get('/getAllDoctors',authMiddleware,getAllDoctorsController);
// router.get("/getAllDoctors", getAllDoctorsController); // ✅ Matches frontend request




// module.exports=router;





const express = require('express');
const {
    loginController,
    registerController,
    authController,
    applyDoctorController,
    getAllNotificationController,
    deleteAllNotificationController,
    getAllDoctorsController,
    bookAppointmentController,
    //bookingAvailabilityController,
    userAppointmentsController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/getUserData', authMiddleware, authController);
router.post('/apply-doctor', authMiddleware, applyDoctorController);
router.post('/get-all-notifications',authMiddleware,getAllNotificationController);
router.post('/delete-all-notification',authMiddleware,deleteAllNotificationController);
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);
router.post('/book-appointment', authMiddleware, bookAppointmentController);
//router.post('/booking-availability', authMiddleware, bookingAvailabilityController);
router.get('/user-appointments', authMiddleware, userAppointmentsController);


module.exports = router;
