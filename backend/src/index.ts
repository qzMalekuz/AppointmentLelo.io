import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth';
import serviceRoutes from './routes/service';
import appointmentRoutes from './routes/appointment';
import providerRoutes from './routes/provider';

const app = express();
const port = Number(process.env.PORT);

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/providers', providerRoutes);

app.listen(port, () => {
    console.log(`Listening to Karan Aujla on port ${port}`);
});