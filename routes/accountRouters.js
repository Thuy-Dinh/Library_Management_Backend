const express = require("express");

const {
    handleLogin,
    getAllUser
} = require("../controllers/accountController");

const router = express.Router();

router.post('/login', handleLogin);
router.get('/all-user', getAllUser);

module.exports = router;

