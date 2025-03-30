 const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel"); 
const { message } = require("antd");
const mongoose = require("mongoose");
const moment=require('moment')

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({ message: "User Already Exists", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    res.status(500).send({ success: false, message: `Register Error: ${error.message}` });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    res.status(500).send({ message: `Login Error: ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select("-password");
    if (!user) {
      return res.status(200).send({ message: "User not found", success: false });
    }
    res.status(200).send({ success: true, data: user });
  } catch (error) {
    res.status(500).send({ message: "Authentication error", success: false });
  }
};




const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied SUccessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error WHile Applying For Doctotr",
    });
  }
};




const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) return res.status(400).send({ success: false, message: "User not found" });

    user.seennotification.push(...user.notification);
    user.notification = [];
    await user.save();

    res.status(200).send({ success: true, message: "Notifications marked as read", data: user });
  } catch (error) {
    res.status(500).send({
       message: "Error in getting notifications",
      success: false ,
    });
  }
};


const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    user.notification=[];
    user.seennotification=[];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};
    

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
       success: true,
        message: "Doctors list fetched successfully",
         data: doctors
         });
  } catch (error) {
    res.status(500).send({ 
      success: false, 
      error,
      message: "Error while fetching doctors"
     });
  }
};



const bookAppointmentController = async (req, res) => {
  try {
    console.log(" Received Booking Request:", req.body);

    if (mongoose.connection.readyState !== 1) {
      console.error(" Database not connected");
      return res.status(500).json({ success: false, message: "Database not connected" });
    }

    const { userId, doctorId, doctorInfo, userInfo, date, time } = req.body;

    const formattedDoctorInfo = JSON.stringify(doctorInfo);
    const formattedUserInfo = JSON.stringify(userInfo);

    const dateParts = date.split("-"); 
    const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`); 

    const formattedTime = Array.isArray(time) ? time.join(", ") : time;

    const newAppointment = new appointmentModel({
      userId,
      doctorId,
      doctorInfo: formattedDoctorInfo, 
      userInfo: formattedUserInfo, 
      date: formattedDate, 
      time: formattedTime, 
      status: "pending", 
    });

    await newAppointment.save();
    console.log("Appointment saved successfully");

    const doctor = await userModel.findOne({ _id: doctorId });

    if (!doctor) {
      console.error("Doctor not found");
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    if (!doctor.notification) {
      doctor.notification = [];
    }

    doctor.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${userInfo.name}`,
      onClickPath: "/user/appointments",
    });

    await doctor.save();
    console.log(" Notification added to doctor");

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
    });

  } catch (error) {
    console.error(" Error booking appointment:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Error while booking appointment",
      error: error.message,
    });
  }
};


const userAppointmentsController = async (req, res) => {
  try{
    const appointments = await appointmentModel.find({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "User appointments fetched successfully",
      data: appointments,
    });
  }catch{
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error while fetching appointments",
    });

  }


}

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  userAppointmentsController,
};
