// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const bcrypt = require('bcrypt');

// // Kết nối tới MongoDB
// require('dotenv').config();
// const queryString = process.env.MONGODB_URI;
// mongoose.connect(queryString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })

// mongoose.connect(queryString)
//   .then(() => console.log('MongoDB connected!'))
//   .catch((err) => console.log('MongoDB connection error:', err.message));

// mongoose.connection.on('error', (err) => {
//   console.log('MongoDB connection error:', err.message);
// });


// // Tạo schema cho User
// const AccountSchema = new mongoose.Schema({
//     AccountID: Number,
//     Email: String,
//     Password: String,
//     Name: String,
//     Gender: String,
//     Age: Number,
//     Role: String
// });

// // Hàm mã hóa mật khẩu trước khi lưu vào database
// AccountSchema.pre('save', async function(next) {
//     if (this.isModified('Password') || this.isNew) {
//         const salt = await bcrypt.genSalt(10);
//         this.Password = await bcrypt.hash(this.Password, salt);
//     }
//     next();
// });

// // Tạo model từ schema
// const Account = mongoose.model('Account', AccountSchema);

// // Hàm tạo và lưu User mới vào database
// async function createUser(AccountID, Email, Password, Name, Gender, Age, Role) {
//     try {
//         const newAccount = new Account({ AccountID, Email, Password, Name, Gender, Age, Role });
//         await newAccount.save();
//         console.log('account created successfully');
//     } catch (error) {
//         console.error('Error creating account:', error);
//     }
// }

// // Gọi hàm tạo user mẫu
// createUser('1', 'thuydinh2904@gmail.com', '29042003', 'Thùy', 'Nữ', '21', 'User');
