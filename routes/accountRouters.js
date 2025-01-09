const express = require("express");

const {
    handleSignup,
    handleLogin,
    getAllUser,
    getAUser
} = require("../controllers/accountController");

const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.get('/all-user', getAllUser);
router.post('/get-user', getAUser);

module.exports = router;

