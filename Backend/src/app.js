import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv';
import morgan from 'morgan';

import appointmentRoutes from './routes/appointment.routes';

dotenv.config();

const app = express();
const port = process.env.APP_BACKEND_PORT || 4003;

var corsOptions = {
	origin: `http://${process.env.FRONTEND_HOST}:${process.env.APP_FRONTEND_PORT}`
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use("/api/appointment", appointmentRoutes);

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true
	})
	.then(() => {
		console.log('DB connected');
	})
	.catch(err => {
		console.error('DB connection error', err);
		process.exit(1);
	});

mongoose.set('debug', false);

app.listen(port, () => {
	console.log(`Challenge Backend listening at ${process.env.BACKEND_HOST}:${process.env.APP_BACKEND_PORT}`);
});

export default app;