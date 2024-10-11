import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';


const app = express();


mongoose.connect(process.env.MONGODB_URI!)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());




const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});