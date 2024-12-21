const express = require("express");

const {
    bookFavorite,
    bookLastest,
    bookDetail,
    proposeBook,
    getAllBook,
    createBook,
    getAllTopic
} = require("../controllers/bookController");

const router = express.Router();

router.get('/favorite-book', bookFavorite);
router.get('/lastest-book', bookLastest);
router.get('/book-detail/:id', bookDetail);
router.get('/book-proposes/:id', proposeBook);

router.get('/all-book', getAllBook);

router.post('/create-book', createBook);

router.get('/all-topic', getAllTopic);

module.exports = router;

