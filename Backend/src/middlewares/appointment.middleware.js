import Joi from 'joi';
import Appointment from '../models/appointment.model';

const schema = Joi.object({
    date: Joi.date()
        .required(),

    startTime: Joi.number()
        .required(),

    name: Joi.string()
        .required(),

    email: Joi.string()
        .required().email()
});

const editSchema = Joi.object({
    date: Joi.date()
        .required(),

    startTime: Joi.number()
        .required(),

    name: Joi.string()
        .required(),

    email: Joi.string()
        .required().email()
});

async function verifyBody(req, res, next){
    try {
        const validation = await schema.validateAsync(req.body);
        next();
    }
    catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
     }
};

async function verifyEditBody(req, res, next){
    try {
        const validation = await editSchema.validateAsync(req.body);
        next();
    }
    catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
     }
};

function verifyTime(req, res, next){
    const date = req.body.date;
    const startTime = req.body.startTime;
    const dateArray = date.split("-");
    if(new Date(dateArray[0], dateArray[1]-1, dateArray[2], startTime, 0, 0) < new Date()){
        return res.status(403).send({
            ok: false,
            code: 'startTimeHasPassed'
        });
    }
    else{
        next();
    }
};

function verifyStartTime(req, res, next){
    const date = req.body.date;
    const startTime = req.body.startTime;
    let formattedDateInit = new Date(date);
    let formattedDateEnd = new Date(date);
    formattedDateEnd.setDate(formattedDateEnd.getDate()+1);
    Appointment.find({ date: { "$gte": new Date(formattedDateInit), "$lt": new Date(formattedDateEnd) } }, (err, appointments) => {
        if(err){
            return res.status(500).send({
                err,
                code: 'readError'
            });
        }
        let startTimeAlreadyTaken;
        appointments.forEach(element => {
            if(element.date.getUTCHours() === startTime){
                startTimeAlreadyTaken = true;
            }
        });
        if(startTimeAlreadyTaken){
            return res.status(403).send({
                ok: false,
                code: 'startTimeAlreadyTaken'
            });
        }
        else{
            next();
        }
    });
}

const appointmentMiddleware = {
    verifyBody,
    verifyEditBody,
    verifyTime,
    verifyStartTime
};

export default appointmentMiddleware;