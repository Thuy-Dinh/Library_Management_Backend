const express = require("express");
const upload = require("../multer"); // Import multer middleware

const { 
    createLoan, 
    getAllLoan, 
    getALoan,
    acceptLoan,
    updateLoan
} = require("../controllers/loanController");

const router = express.Router();

// Cấu hình multer để nhận hai file (frontImage và backImage)
router.post('/create-loan', upload.fields([
    { name: "frontImage", maxCount: 1 }, 
    { name: "backImage", maxCount: 1 },  
]), createLoan);

router.post('/all-loan', getAllLoan)
router.get('/loan-detail/:id', getALoan);

router.post('/accept-loan', acceptLoan)

router.post('/update-loan/:id', updateLoan);

module.exports = router;
