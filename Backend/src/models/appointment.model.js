import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Appointment = new Schema({
    date: { type: Date, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }

}, { versionKey: false });

export default mongoose.model('appointments', Appointment);