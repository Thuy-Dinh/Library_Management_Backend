const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account', // Giả sử bạn có model User
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BookSchema = new mongoose.Schema({
    BookID: Number,
    BookCode: String,
    Title: String,
    Author: String,
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    Subcategory: String,
    Tag: String,
    Publisher: String,
    Publication_year: Number,
    Edition: String,
    Summary: String,
    Language: String,
    Availability: String,
    Rating: Number, // Giá trị trung bình (có thể cập nhật khi thêm/sửa đánh giá)
    reviews: [ReviewSchema], // Danh sách đánh giá
    Cover: String,
    CountBorrow: Number,
    Price: String,
    Location: {
        area: String,
        shelf: String,
        slot: String
    }
});

module.exports = mongoose.model('Book', BookSchema);