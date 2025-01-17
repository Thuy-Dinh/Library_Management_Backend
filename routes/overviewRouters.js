const express = require("express");

const {
    bookTotal,
    availableBook,
    getTopBorrowedBooks,
    countBorrowedByTime
} = require("../controllers/overviewController");

const router = express.Router();

router.get('/total-book', bookTotal);
router.get('/available-book', availableBook);
router.get('/top-book', getTopBorrowedBooks);
router.post('/count-book-borrowed', countBorrowedByTime);

module.exports = router;