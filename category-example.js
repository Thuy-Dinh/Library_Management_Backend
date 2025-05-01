const mongoose = require('mongoose');
const Category = require('./models/Category');

const dotenv = require('dotenv');
dotenv.config();

const queryString = process.env.MONGODB_URI;
mongoose.connect(queryString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

async function createCategories() {
    const categories = [
        {
            Name: "Văn học",
            Cover: "https://example.com/vanhoc.jpg",
            Quantity: 0,
            Books: []
        },
        {
            Name: "Phát triển bản thân",
            Cover: "https://example.com/phattrien.jpg",
            Quantity: 0,
            Books: []
        },
        {
            Name: "Tri thức & khám phá",
            Cover: "https://example.com/trithuc.jpg",
            Quantity: 0,
            Books: []
        }
    ];

    const inserted = await Category.insertMany(categories);
    console.log("Đã tạo các Category:", inserted);
    return inserted;
}

createCategories().then(() => mongoose.disconnect());