const express = require("express");
const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController, // ✅ Uncommented and imported correctly
} = require("../controllers/adminCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// GET all users
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// GET all doctors
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// POST Account Status
router.post("/changeAccountStatus", authMiddleware, changeAccountStatusController);

module.exports = router;



// const express = require("express");
// const {
//   getAllUsersController,
//   getAllDoctorsController,
//   changeAccountStatusController,
// } = require("../controllers/adminCtrl");
// const router = express.Router();
// router.get("/getAllUsers", authMiddleware, getAllUsersController);

// router.get("/getAllDoctors", getAllDoctorsController);
// router.post("/changeAccountStatus", changeAccountStatusController); // Ensure this route exists

// module.exports = router;
