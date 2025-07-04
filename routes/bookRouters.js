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
    getCategory,
    createTopic,
    searchByCategory,
    searchSuggestion,
    searchResult,
    searchBookByOtherField,
    getAllAreas,
    recommendBooks,
    addReview
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
router.get('/categories/:id', getCategory);

router.get('/topic-books', searchByCategory);
router.get('/search-suggestions', searchSuggestion);
router.get('/search-result', searchResult);
router.get('/search', searchBookByOtherField);

router.post('/create-topic', createTopic);

router.get('/areas', getAllAreas);

router.get('/recommend/:accountId', recommendBooks);

router.post('/:bookId/review', addReview);

module.exports = router;

