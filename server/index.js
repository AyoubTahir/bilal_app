import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';

import corsOptions from './config/corsOptions.js';
import authRoutes from './routes/authRouts.js';

const PORT = process.env.PORT || 3500;

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
