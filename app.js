const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require("path");

// Đường dẫn thư mục uploads
const uploadDir = path.join(__dirname, "../uploads");

// Kiểm tra xem thư mục uploads có tồn tại không
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Tạo thư mục nếu không có
    console.log("Thư mục uploads đã được tạo.");
} else {
    console.log("Thư mục uploads đã tồn tại.");
}

//middleware
app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const accountRouter = require("./routes/accountRouters");
app.use("/", accountRouter);

const bookRouter = require("./routes/bookRouters");
app.use("/book", bookRouter);

const loanRouter = require("./routes/loanRouters");
app.use("/loan", loanRouter);

app.listen(3050, ()=>{
    console.log("Server is running on port 3050");
});

module.exports = app;

const mongoose = require("mongoose");
dotenv.config();
const queryString = process.env.MONGODB_URI;

mongoose.connect(queryString, {
  tlsInsecure: true
})

mongoose.connect(queryString)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('MongoDB connection error:', err.message));

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err.message);
});
