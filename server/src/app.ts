import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import "./config/passport"
import session from 'express-session';
import MongoStore from 'connect-mongo';

//rutas
import authRoute from './routes/auth';

const app = express();


mongoose.connect(process.env.MONGODB_URI!)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI!,
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, //1 día
    }

}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoute);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});