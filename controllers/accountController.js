const jwt = require('jsonwebtoken');
const accountService = require("../services/accountService");
const AccountSchema = require("../models/Account");

exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Các trường dữ liệu không được để trống!'
        });
    }

    // Xử lý đăng nhập
    const accountData = await accountService.handleUserLogin(email, password);
    console.log(accountData);

    if (accountData.errCode !== 0) {
        return res.status(400).json({
            errCode: accountData.errCode,
            message: accountData.errMessage,
        });
    }

    // Tạo JWT token
    const token = jwt.sign(
        { userId: accountData.account._id, email: accountData.account.Email },
        'your_secret_key', // Thay thế 'your_secret_key' bằng khóa bí mật của bạn
        { expiresIn: '1h' } // Token hết hạn sau 1 giờ
    );

    // Trả về thông tin người dùng cùng với token
    return res.status(200).json({
        errCode: accountData.errCode,
        message: accountData.errMessage,
        account: accountData.account,
        token: token, // Thêm token vào phản hồi
    });
};

exports.getAllUser = async (req, res) => {
    try {
        const allUser = await accountService.getAllUserSV();

        if (!allUser) {
            return res.status(200).json({});
        } else {
            return res.status(200).json({ allUser });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getAUser = async (req, res) => {
    const id = req.body.id;

    try {
        if (!id) {
            return res.status(500).json({
                errCode: 1,
                message: 'Các trường dữ liệu không được để trống!'
            });
        }

        const user = await accountService.getAUserSV(id);

        if (!user) {
            return res.status(200).json({});
        } else {
            return res.status(200).json({ user });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};