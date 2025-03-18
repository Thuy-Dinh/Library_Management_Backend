const express = require("express");

const {
    handleSignup,
    handleLogin,
    confirmEmail,
    getAllUser,
    getAUser,
    limitedAccount
} = require("../controllers/accountController");

const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/comfirm', confirmEmail);
router.get('/all-user', getAllUser);
router.post('/get-user', getAUser);

router.post('/limited', limitedAccount);

module.exports = router;

