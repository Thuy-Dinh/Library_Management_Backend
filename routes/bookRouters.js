const express = require("express");

const {
    bookFavorite,
    bookLastest,
    bookDetail,
    proposeBook,
    getAllBook
} = require("../controllers/bookController");

const router = express.Router();

router.get('/favorite-book', bookFavorite);
router.get('/lastest-book', bookLastest);
router.get('/book-detail/:id', bookDetail);
router.get('/book-proposes/:id', proposeBook);

router.get('/all-book', getAllBook);

module.exports = router;

