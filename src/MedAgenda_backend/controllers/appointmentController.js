const {
  newAppointmentSchema,
  cancelAppointment,
} = require("../middlewares/validator.js");
const appointmentModel = require("../models/appointmentModel.js");
const doctorModel = require("../models/doctorModel.js");
const userModel = require("../models/usersModel.js");

exports.viewAppointments = async (req, res) => {
  const {isAdmin, userId} = req.user;
  const {_id} = req.query;
  try {
    if (isAdmin) {
      const appointments = await appointmentModel.find({});
      
      // Populate manual para agendamentos salvos como arrays
      const populatedAppointments = await Promise.all(appointments.map(async (appointment) => {
        const appointmentObj = appointment.toObject();
        
        console.log("Processando agendamento:", appointmentObj._id);
        console.log("User array:", appointmentObj.user);
        console.log("Doctor array:", appointmentObj.doctor);
        
        // Populate user
        if (Array.isArray(appointmentObj.user) && appointmentObj.user.length > 0) {
          const userId = appointmentObj.user[0];
          console.log("Buscando usuário com ID:", userId);
          const user = await userModel.findById(userId).select('name email');
          console.log("Usuário encontrado:", user);
          appointmentObj.user = user;
        }
        
        // Populate doctor
        if (Array.isArray(appointmentObj.doctor) && appointmentObj.doctor.length > 0) {
          const doctorId = appointmentObj.doctor[0];
          console.log("Buscando médico com ID:", doctorId);
          const doctor = await doctorModel.findById(doctorId).select('name speciality');
          console.log("Médico encontrado:", doctor);
          appointmentObj.doctor = doctor;
        }
        
        console.log("Agendamento final:", {
          id: appointmentObj._id,
          user: appointmentObj.user,
          doctor: appointmentObj.doctor
        });
        
        return appointmentObj;
      }));
      
      console.log("--- DADOS NO BACKEND ---");
      console.log("Número de agendamentos:", populatedAppointments.length);
      if (populatedAppointments.length > 0) {
        console.log("Primeiro agendamento:", {
          id: populatedAppointments[0]._id,
          user: populatedAppointments[0].user,
          doctor: populatedAppointments[0].doctor,
          slotDate: populatedAppointments[0].slotDate,
          slotTime: populatedAppointments[0].slotTime
        });
      }
      console.log("--- FIM DOS DADOS ---");
      res.status(200).json({success: true, appointments: populatedAppointments});
    } else {
      if (_id !== userId) {
        return res.status(401).json({success: false, message: "Unauthorized"});
      }
      const appointments = await appointmentModel.find({user: _id});
      
      // Populate manual para usuários comuns
      const populatedAppointments = await Promise.all(appointments.map(async (appointment) => {
        const appointmentObj = appointment.toObject();
        
        if (Array.isArray(appointmentObj.user) && appointmentObj.user.length > 0) {
          const user = await userModel.findById(appointmentObj.user[0]).select('name email');
          appointmentObj.user = user;
        }
        
        if (Array.isArray(appointmentObj.doctor) && appointmentObj.doctor.length > 0) {
          const doctor = await doctorModel.findById(appointmentObj.doctor[0]).select('name speciality');
          appointmentObj.doctor = doctor;
        }
        
        return appointmentObj;
      }));
      
      res.status(200).json({success: true, appointments: populatedAppointments});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({success: false, message: "Erro interno do servidor"});
  }
};

exports.newAppointment = async (req, res) => {
  const {isAdmin, userId: userIdToken} = req.user;

  try {
    const {userId, docId, slotDate, slotTime} = req.body;

    if (userId !== userIdToken && !isAdmin) {
      return res.status(401).json({success: false, message: "Unauthorized"});
    }
    const {error, value} = newAppointmentSchema.validate({
      userId,
      docId,
      slotDate,
      slotTime,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const docData = await doctorModel.findById(docId);
    let slots_booked = docData.scheduledAppointments;
    if (slots_booked && slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res
          .status(403)
          .json({success: false, message: "Slot Not Available"});
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    const userData = await userModel.findById(userId).select("-password");
    const appointmentData = {
      user: userData._id,
      doctor: docData._id,
      amount: docData.pricePerAppointment,
      slotTime,
      slotDate,
      date: Date.now(),
    };
    delete docData.slots_booked;
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, {
      scheduledAppointments: slots_booked,
    });
    res.json({success: true, message: "Appointment Booked", newAppointment});
  } catch (error) {
    console.log(error);
  }
};

const userCancelAppointment = async (req, res) => {
  try {
    const {userId, appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData.userId !== userId) {
      return res.json({success: false, message: "Unauthorized action"});
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true});
    const {docId, slotDate, slotTime} = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, {slots_booked});
    res.json({success: true, message: "Appointment Cancelled"});
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
};

exports.cancelAppointment = async (req, res) => {
  const {isAdmin, userId: userIdToken} = req.user;
  const {userId, appointmentId} = req.body;
  const {error, value} = cancelAppointment.validate({
    userId,
    appointmentId,
  });

  if (error) {
    return res.status(401).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const appointmentData = await appointmentModel.findById(appointmentId);
  if (userId !== userIdToken && !isAdmin) {
    return res.status(401).json({success: false, message: "Unauthorized"});
  }

  if (appointmentData.user[0].toHexString() !== userId) {
    return res.status(401).json({success: false, message: "Unauthorized"});
  }

  if (appointmentData.cancelled) {
    return res.status(403).json({
      success: false,
      message: "This Appointment was already cancelled!",
    });
  }

  await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true});
  const {doctor, slotDate, slotTime} = appointmentData;
  const doctorData = await doctorModel.findById(doctor);
  let slots_booked = doctorData.scheduledAppointments;
  slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
  await doctorModel.findByIdAndUpdate(doctor, {
    scheduledAppointments: slots_booked,
  });
  res.json({success: true, message: "Appointment Cancelled"});
  try {
  } catch (error) {
    console.log(error);
  }
};
