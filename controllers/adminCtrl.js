const userModel = require("../models/userModels"); 
const doctorModel = require("../models/doctorModel"); 

const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).json({
            success: true,
            message: "Users data list",
            data: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Error while fetching users",
            error: error.message,
        });
    }
};

const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).json({
            success: true,
            message: "Doctors data list",
            data: doctors,
        });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({
            success: false,
            message: "Error while fetching doctors data",
            error: error.message,
        });
    }
};




const changeAccountStatusController = async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
      const user = await userModel.findOne({ _id: doctor.userId });
      const notification = user.notification;
      notification.push({
        type: "doctor-account-request-updated",
        message: `Your Doctor Account Request Has ${status} `,
        onClickPath: "/notification",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();
      res.status(201).send({
        success: true,
        message: "Account Status Updated",
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror in Account Status",
        error,
      });
    }
  };

module.exports = { 
    getAllDoctorsController, 
    getAllUsersController, 
    changeAccountStatusController, 
};
