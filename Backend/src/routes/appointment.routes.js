import express from 'express';
import controller from '../controllers/appointment.controller';
import middleware from '../middlewares/appointment.middleware';

const router = express.Router();

router.post('/', [middleware.verifyBody, middleware.verifyTime, middleware.verifyStartTime], controller.createAppointment);
router.get('/', controller.readAppointments);
router.get('/byDate/:date', controller.readAppointmentsByDate);
router.get('/byId/:id', controller.readAppointmentById);
router.put('/:id', [middleware.verifyEditBody], controller.updateAppointment);
router.delete('/:id', controller.deleteAppointment);

export default router;