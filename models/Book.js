const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    BookID: Number,
    Title: String,
    Author: String,
    Topic: String,
    Subcaterory: String,
    Tag: String,
    Publisher: String,
    Publication_year: Number,
    Edition: String,
    Summary: String,
    Language: String,
    Availability: String,
    Rating: Number,
    Cover: String,
    CountBorrow: Number
});

module.exports = mongoose.model('Book', BookSchema);