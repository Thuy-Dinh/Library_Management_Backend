const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Kết nối tới MongoDB
dotenv.config();
const queryString = process.env.MONGODB_URI;

mongoose.connect(queryString, {
  tlsInsecure: true
})
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('MongoDB connection error:', err.message));

// Định nghĩa schema
const accountSchema = new mongoose.Schema({
  AccountID: { type: Number, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Name: { type: String, required: true },
  Gender: { type: String },
  Age: { type: Number },
  Role: { type: String, required: true },
  State: { type: String, default: 'Active' }
});

// Middleware để hash mật khẩu trước khi lưu
accountSchema.pre('save', async function (next) {
  if (this.isModified('Password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
  }
  next();
});

const Account = mongoose.model('Account', accountSchema);

// Tạo dữ liệu
const insertAccount = async () => {
  const AccountInsert = {
    AccountID: 3,
    Email: 'dinhphuongthuy2904+test@gmail.com',
    Password: '29042003',
    Name: 'Thùy Đinh',
    Gender: 'nữ',
    Age: 18,
    Role: 'user',
    State: 'Active'
  };

  try {
    const account = await Account.create(AccountInsert);
    console.log("Additional data inserted successfully:", account);
  } catch (error) {
    console.error("Error inserting additional data:", error.message);
  } finally {
    mongoose.connection.close(); // Đóng kết nối sau khi thực hiện xong
  }
};

// Gọi hàm
insertAccount();
