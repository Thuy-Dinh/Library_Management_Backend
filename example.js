// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const bcrypt = require('bcryptjs');

// // Kết nối tới MongoDB
// require('dotenv').config();
// const queryString = process.env.MONGODB_URI;
// mongoose.connect(queryString, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     tlsInsecure: true
// })

// mongoose.connect(queryString)
//   .then(() => console.log('MongoDB connected!'))
//   .catch((err) => console.log('MongoDB connection error:', err.message));

// mongoose.connection.on('error', (err) => {
//   console.log('MongoDB connection error:', err.message);
// });

// // const Loan = require('./models/Loan');

// // const LoanInsert = {
// //   LoanID: 1,
// //   AccountID: new mongoose.Types.ObjectId('671f29c0264cc341ac47a3a6'), // Chuyển sang ObjectId
// //   BookID: new mongoose.Types.ObjectId('673676f824db5d323291ea51'), // Chuyển sang ObjectId
// //   DayStart: new Date('2024-11-01'), // Chuyển sang Date
// //   DayEnd: new Date('2024-01-20'),   // Chuyển sang Date
// //   Note: null,
// //   State: 'Đang mượn'
// // };

// // Thêm tài liệu vào MongoDB
// // Loan.create(LoanInsert)
// //   .then(() => console.log("Additional data inserted successfully"))
// //   .catch((error) => console.error("Error inserting additional data:", error))
// //   .finally(() => mongoose.connection.close()); // Đóng kết nối sau khi thực hiện xong

// // // Tạo schema cho User
// // const AccountSchema = new mongoose.Schema({
// //     AccountID: Number,
// //     Email: String,
// //     Password: String,
// //     Name: String,
// //     Gender: String,
// //     Age: Number,
// //     Role: String,
// //     State: String
// // });

// // // Hàm mã hóa mật khẩu trước khi lưu vào database
// // AccountSchema.pre('save', async function(next) {
// //     if (this.isModified('Password') || this.isNew) {
// //         const salt = await bcrypt.genSalt(10);
// //         this.Password = await bcrypt.hash(this.Password, salt);
// //     }
// //     next();
// // });

// // // Tạo model từ schema
// // const Account = mongoose.model('Account', AccountSchema);

// const admin = require('./models/Account');

// const AccountInsert = {
//   AccountID: 2,
//   Email: 'dinhphuongthuy2904+admin@gmail.com',
//   Password: '29042003',
//   Name: 'Admin',
//   Gender: 'nữ',
//   Age: 30,
//   Role: 'admin',
//   State: 'Active'
// };

// admin.create(AccountInsert)
//   .then((
//     AccountSchema.pre('save', async function(next) {
//           if (this.isModified('Password') || this.isNew) {
//               const salt = await bcrypt.genSalt(10);
//               this.Password = await bcrypt.hash(this.Password, salt);
//           }
//           next();
//     })
//   ) => console.log("Additional data inserted successfully"))
//   .catch((error) => console.error("Error inserting additional data:", error))
//   .finally(() => mongoose.connection.close()); // Đóng kết nối sau khi thực hiện xong

// // const Book = require('./models/Book'); 

// // const additionalBookData = [
// //   {
// //     BookID: 11,
// //     Title: "The Hobbit",
// //     Author: "J.R.R. Tolkien",
// //     Topic: "Fantasy",
// //     Subcaterory: "Adventure",
// //     Tag: "Fiction",
// //     Publisher: "George Allen & Unwin",
// //     Publication_year: 1937,
// //     Edition: "First",
// //     Summary: "A hobbit's journey to reclaim a lost kingdom and treasure.",
// //     Language: "English",
// //     Availability: "Available",
// //     Rating: 4.7,
// //     Cover: "https://s3.amazonaws.com/gs-geo-images/cd76c55b-9830-44d9-8596-95678d41b7cf.jpg",
// //     CountBorrow: 250
// //   },
// //   {
// //     BookID: 12,
// //     Title: "Crime and Punishment",
// //     Author: "Fyodor Dostoevsky",
// //     Topic: "Psychological Fiction",
// //     Subcaterory: "Classic",
// //     Tag: "Fiction",
// //     Publisher: "The Russian Messenger",
// //     Publication_year: 1866,
// //     Edition: "First",
// //     Summary: "A young man grapples with guilt after committing murder.",
// //     Language: "Russian",
// //     Availability: "Unavailable",
// //     Rating: 4.5,
// //     Cover: "https://m.media-amazon.com/images/I/71O2XIytdqL._AC_UF1000,1000_QL80_.jpg",
// //     CountBorrow: 130
// //   },
// //   {
// //     BookID: 13,
// //     Title: "The Divine Comedy",
// //     Author: "Dante Alighieri",
// //     Topic: "Epic Poetry",
// //     Subcaterory: "Classic",
// //     Tag: "Fiction",
// //     Publisher: "John Murray",
// //     Publication_year: 1320,
// //     Edition: "First",
// //     Summary: "An epic journey through Hell, Purgatory, and Heaven.",
// //     Language: "Italian",
// //     Availability: "Available",
// //     Rating: 4.6,
// //     Cover: "https://m.media-amazon.com/images/I/51i-9SGWr-L._AC_UF1000,1000_QL80_.jpg",
// //     CountBorrow: 85
// //   },
// //   {
// //     BookID: 14,
// //     Title: "Anna Karenina",
// //     Author: "Leo Tolstoy",
// //     Topic: "Literature",
// //     Subcaterory: "Classic",
// //     Tag: "Fiction",
// //     Publisher: "The Russian Messenger",
// //     Publication_year: 1878,
// //     Edition: "First",
// //     Summary: "A tragic story of love and betrayal in Russian aristocracy.",
// //     Language: "Russian",
// //     Availability: "Available",
// //     Rating: 4.7,
// //     Cover: "https://peribo.com.au/wp-content/uploads/9781853262715-15.jpg",
// //     CountBorrow: 90
// //   },
// //   {
// //     BookID: 15,
// //     Title: "The Odyssey",
// //     Author: "Homer",
// //     Topic: "Epic",
// //     Subcaterory: "Ancient Greek Literature",
// //     Tag: "Fiction",
// //     Publisher: "Various",
// //     Publication_year: -800,
// //     Edition: "First",
// //     Summary: "The journey of Odysseus back home after the Trojan War.",
// //     Language: "Greek",
// //     Availability: "Available",
// //     Rating: 4.4,
// //     Cover: "https://m.media-amazon.com/images/I/A1JR2oK-orL._AC_UF1000,1000_QL80_.jpg",
// //     CountBorrow: 120
// //   },
// //   {
// //     BookID: 16,
// //     Title: "The Brothers Karamazov",
// //     Author: "Fyodor Dostoevsky",
// //     Topic: "Philosophical Fiction",
// //     Subcaterory: "Classic",
// //     Tag: "Fiction",
// //     Publisher: "The Russian Messenger",
// //     Publication_year: 1880,
// //     Edition: "First",
// //     Summary: "A complex tale of faith, doubt, and family conflict.",
// //     Language: "Russian",
// //     Availability: "Unavailable",
// //     Rating: 4.8,
// //     Cover: "https://m.media-amazon.com/images/I/71OZJsgZzQL._AC_UF1000,1000_QL80_.jpg",
// //     CountBorrow: 95
// //   },
// //   {
// //     BookID: 17,
// //     Title: "Frankenstein",
// //     Author: "Mary Shelley",
// //     Topic: "Gothic Fiction",
// //     Subcaterory: "Science Fiction",
// //     Tag: "Fiction",
// //     Publisher: "Lackington, Hughes, Harding, Mavor & Jones",
// //     Publication_year: 1818,
// //     Edition: "First",
// //     Summary: "A scientist creates a monster that turns against him.",
// //     Language: "English",
// //     Availability: "Available",
// //     Rating: 4.3,
// //     Cover: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781982146160/frankenstein-9781982146160_hr.jpg",
// //     CountBorrow: 175
// //   },
// //   {
// //     BookID: 18,
// //     Title: "Jane Eyre",
// //     Author: "Charlotte Brontë",
// //     Topic: "Romance",
// //     Subcaterory: "Classic",
// //     Tag: "Fiction",
// //     Publisher: "Smith, Elder & Co.",
// //     Publication_year: 1847,
// //     Edition: "First",
// //     Summary: "The story of an orphaned girl and her journey to independence.",
// //     Language: "English",
// //     Availability: "Available",
// //     Rating: 4.6,
// //     Cover: "https://m.media-amazon.com/images/I/61N-UOA0alL._UF1000,1000_QL80_.jpg",
// //     CountBorrow: 145
// //   },
// //   {
// //     BookID: 19,
// //     Title: "Fahrenheit 451",
// //     Author: "Ray Bradbury",
// //     Topic: "Dystopian",
// //     Subcaterory: "Science Fiction",
// //     Tag: "Fiction",
// //     Publisher: "Ballantine Books",
// //     Publication_year: 1953,
// //     Edition: "First",
// //     Summary: "A dystopian future where books are banned and burned.",
// //     Language: "English",
// //     Availability: "Available",
// //     Rating: 4.5,
// //     Cover: "https://upload.wikimedia.org/wikipedia/en/d/db/Fahrenheit_451_1st_ed_cover.jpg",
// //     CountBorrow: 180
// //   },
// //   {
// //     BookID: 20,
// //     Title: "Dracula",
// //     Author: "Bram Stoker",
// //     Topic: "Horror",
// //     Subcaterory: "Gothic Fiction",
// //     Tag: "Fiction",
// //     Publisher: "Archibald Constable and Company",
// //     Publication_year: 1897,
// //     Edition: "First",
// //     Summary: "The story of the vampire Count Dracula's attempt to spread undead curse.",
// //     Language: "English",
// //     Availability: "Available",
// //     Rating: 4.5,
// //     Cover: "https://m.media-amazon.com/images/I/91wOUFZCE+L._UF1000,1000_QL80_.jpg",
// //     CountBorrow: 160
// //   }
// // ];

// // // Lưu thêm dữ liệu vào MongoDB
// // Book.insertMany(additionalBookData)
// //   .then(() => console.log("Additional data inserted successfully"))
// //   .catch((error) => console.error("Error inserting additional data:", error));

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Kết nối tới MongoDB
dotenv.config();
const queryString = process.env.MONGODB_URI;

mongoose.connect(queryString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
    AccountID: 2,
    Email: 'dinhphuongthuy2904+admin@gmail.com',
    Password: '29042003',
    Name: 'Admin',
    Gender: 'nữ',
    Age: 30,
    Role: 'admin',
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
