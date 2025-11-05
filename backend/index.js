const express = require('express');
const authRoutes = require('./routes/authRoutes');
const  databaseConfig = require('./config/databaseConfig');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

databaseConfig();


app.use(express.json());

app.use ('/api/auth', authRoutes);




app.listen(8000, () => {
        console.log('Server started on port 8000');
    });