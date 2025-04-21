const express = require("express");

const {
    bookTotal,
    availableBook,
    getTopBorrowedBooks,
    countBorrowedByTime,
    getBorrowedByMonth,
    getDamagedBooksCount
} = require("../controllers/overviewController");

const router = express.Router();

router.get('/total-book', bookTotal);
router.get('/available-book', availableBook);
router.get('/top-book', getTopBorrowedBooks);
router.post('/count-book-borrowed', countBorrowedByTime);
router.get('/borrowed-by-month', getBorrowedByMonth);
router.get('/damaged-books', getDamagedBooksCount);

module.exports = router;