const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Adjust this to your frontend URL
    // credentials: true, // Allow cookies to be sent with requests
  })
);

// require all the routes here
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

// Using all the routes here
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

module.exports = app;
