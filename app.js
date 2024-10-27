const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const accountRouter = require("./routes/accountRouters");
app.use("/", accountRouter);

app.listen(3050, ()=>{
    console.log("Server is running on port 3050");
});

module.exports = app;

const mongoose = require("mongoose");
dotenv.config();
const queryString = process.env.MONGODB_URI;

mongoose.connect(queryString)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('MongoDB connection error:', err.message));

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err.message);
});
