const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");

const getDoctorInfoController = async (req, res) => {
  try {
    console.log("Received userId in controller:", req.body.userId);

    if (!req.body.userId) {
      return res.status(400).send({ success: false, message: "Missing userId in request" });
    }

    const doctor = await doctorModel.findOne({ userId: req.body.userId });

    console.log("Doctor found:", doctor);

    if (!doctor) {
      return res.status(404).send({ success: false, message: "Doctor not found" });
    }

    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error fetching doctor info:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching doctor info",
      error,
    });
  }
};




const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
    );
    res.status(200).send({ 
      success: true,
       message: "Profile updated successfully", 
       data: doctor,
       });
  } catch (error) {
    res.status(500).send({ 
      success: false, 
      message: "Error while updating profile",
       error });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    res.status(200).send({ 
      success: true, 
      message: "Appointment booked successfully" 
    });
  } catch (error) {
    res.status(500).send({ 
      success: false,
      error,
       message: "Error while booking appointment"
       });
  }
};

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({_id:req.body.doctorId});
    res.status(200).send({
      success: true,
      message: "Doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetchimg Doctor Details",
    });
  };
};



const doctorAppointmentsController = async (req, res) => {
  try{
    const doctor = await doctorModel.findOne({userId:req.body.userId});
    const appointments=await appointmentModel.find({doctorId:doctor._id,

    });
    res.status(200).send({
      success:true,
      message:"Doctor appointments fetched successfully",
      data:appointments,
    });
  }catch(error){
    console.log(error);
      res.status(500).send({
        success:false,
        message:"Error while fetching doctor appointments",
        error,
      });
    };
  }




 const updateStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true } 
    );

    if (!appointment) {
      return res.status(404).send({ success: false, message: "Appointment not found" });
    }

    const user = await userModel.findById(appointment.userId);
    if (!user) {
      return res.status(404).send({ success: false, message: " User not found" });
    }

    user.notification.push({
      type: "New-appointment-request",
      message: `Your appointment status has been updated to ${status}`,
      onClickPath: "/user/appointments",
    });

    await user.save(); 

    res.status(200).send({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment,
    });

  } catch (error) {
    console.log(" Error while updating status:", error);
    res.status(500).send({
      success: false,
      message: " Error while updating status",
      error: error.message || error,
    });
  }
};
module.exports = {
  updateProfileController,
  getDoctorInfoController,
  bookAppointmentController,
  getDoctorByIdController,
doctorAppointmentsController,
updateStatusController,
};
  