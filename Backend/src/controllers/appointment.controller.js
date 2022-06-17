import Appointment from '../models/appointment.model'

async function createAppointment(req, res){
    const appointment = new Appointment(
        req.body
    );
    appointment.date = appointment.date.getTime() + (req.body.startTime*60*60*1000);
    appointment.email = appointment.email.toLowerCase();
    try{
        appointment.save((err, appointment) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'createError'
                });
            }
            res.status(200).json({
                message: 'Appointment successfully created!', 
                code: 'createSuccess',
                appointment
            });
        });
    }
    catch(err){
        return res.status(500).send({
            err,
            code: 'createError'
        });        
    }
}

async function readAppointments(req, res){
    try{
        Appointment.find((err, appointments) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'readError'
                });
            }
            res.status(200).json({
                appointments
            });
        })
    }
    catch(err){
        return res.status(500).send({
            err,
            code: 'readError'
        });
    }
}

async function readAppointmentsByDate(req, res){
    const date = req.params.date;
    let formattedDateInit = new Date(date);
    let formattedDateEnd = new Date(date);
    formattedDateEnd.setDate(formattedDateEnd.getDate()+1);
    try{
        Appointment.find({ date: { "$gte": new Date(formattedDateInit), "$lt": new Date(formattedDateEnd) } }, (err, appointments) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'readError'
                });
            }
            let formattedAppointments = [];
            appointments.forEach(element => {
                formattedAppointments.push({
                    _id: element._id,
                    startTime: element.date.getUTCHours(),
                    name: element.name,
                    email: element.email,
                    date: date.toString().split(" ")[0]
                })
            })
            res.status(200).json({
                formattedAppointments
            });
        });
    }
    catch(err){
        return res.status(500).send({
            err,
            code: 'readError'
        });
    }
}

async function readAppointmentById(req, res){
    const _id = req.params.id;
    try{
        Appointment.findOne({ _id: _id}, (err, appointment) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'readError'
                });
            }
            appointment.startTime = appointment.date.getUTCHours();
            let formattedAppointment = {
                _id: appointment._id,
                startTime: appointment.date.getUTCHours(),
                name: appointment.name,
                email: appointment.email,
                date: appointment.date.toISOString().split("T")[0]                
            };
            res.status(200).json({
                formattedAppointment
            });
        })
    }
    catch(err){
        return res.status(500).send({
            err,
            code: 'readError'
        });
    }
}

async function updateAppointment(req, res){
    const _id = req.params.id;
    try{
        Appointment.findOne({ _id: _id}, (err, appointment) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'updateError'
                });
            }
            if(req.body.date){
                appointment.date.getTime() + (req.body.startTime*60*60*1000);
            }
            if(req.body.name){
                appointment.name = req.body.name;
            }
            if(req.body.email){
                appointment.email = req.body.email;
            }
            appointment.save((err, appointment) => {
                if(err){
                    return res.status(500).send({
                        err,
                        code: 'updateError'
                    });
                }
                res.status(200).json({
                    message: 'Appointment successfully update!', 
                    code: 'updateSuccess',
                    appointment
                });
            });
        });
    }
    catch(err){
        return res.status(500).send({
            err,
            code: 'updateError'
        });
    }
}

async function deleteAppointment(req, res){
    const _id = req.params.id;
    try{
        Appointment.deleteOne({ _id: _id}, (err, appointment) => {
            if(err){
                return res.status(500).send({
                    err,
                    code: 'deleteError'
                });
            }
            res.status(200).json({
                message: 'Appointment successfully deleted!', 
                code: 'deleteSuccess',
                appointment
            });
        })
    }
    catch(err){
        return res.status(500).send({
            err,
            code: 'deleteError'
        });
    }
}

const appointmentController = {
    createAppointment,
    readAppointments,
    readAppointmentsByDate,
    readAppointmentById,
    updateAppointment,
    deleteAppointment
};

export default appointmentController;