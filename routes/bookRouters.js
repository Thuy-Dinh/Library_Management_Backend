const express = require("express");

const {
    bookFavorite,
    bookLastest,
    bookDetail,
    proposeBook,
    getAllBook,
    createBook,
    editBook, 
    deleteBook,
    getAllTopic,
    createTopic,
    searchByCategory
} = require("../controllers/bookController");

const router = express.Router();

router.get('/favorite-book', bookFavorite);
router.get('/lastest-book', bookLastest);
router.get('/book-detail/:id', bookDetail);
router.get('/book-proposes/:id', proposeBook);

router.get('/all-book', getAllBook);

router.post('/create-book', createBook);
router.post('/update-book/:id', editBook);
router.get('/delete-book/:bookID', deleteBook);

router.get('/all-topic', getAllTopic);
router.get('/topic-books', searchByCategory);

router.post('/create-topic', createTopic);

module.exports = router;

