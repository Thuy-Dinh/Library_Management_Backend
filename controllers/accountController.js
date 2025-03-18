const jwt = require('jsonwebtoken');
const accountService = require("../services/accountService");
const AccountModel = require("../models/Account");
const nodemailer = require('nodemailer');

const sendAccountDetailsEmail = async (email, account) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.GMAIL_APP_PASSWORD, 
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thông tin tài khoản của bạn",
            html: `
                <h2>Chúc mừng! Tài khoản của bạn đã được kích hoạt.</h2>
                <p>Dưới đây là thông tin tài khoản của bạn:</p>
                <ul>
                    <li><strong>Mã thẻ bạn đọc:</strong> ${account.LbCode}</li>
                    <li><strong>Tên:</strong> ${account.Name}</li>
                    <li><strong>Email:</strong> ${account.Email}</li>
                    <li><strong>Số CCCD:</strong> ${account.CCCDNumber}</li>
                    <li><strong>Số điện thoại:</strong> ${account.Phone}</li>
                    <li><strong>Địa chỉ:</strong> ${account.Address}</li>
                    <li><strong>Tuổi:</strong> ${account.Age}</li>
                    <li><strong>Giới tính:</strong> ${account.Gender}</li>
                </ul>
                <p>Vui lòng đăng nhập để sử dụng dịch vụ của chúng tôi.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email đã được gửi thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi gửi email:", error);
    }
};

exports.confirmEmail = async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Thay bằng khóa bí mật
        const account = await AccountModel.findOne({ _id: decoded.userId, Email: decoded.email });

        if (!account) {
            return res.status(400).json({
                errCode: 1,
                message: "Xác nhận không hợp lệ hoặc tài khoản không tồn tại.",
            });
        }

        if (account.State === "Active") {
            return res.status(200).json({
                errCode: 0,
                message: "Tài khoản đã được kích hoạt trước đó.",
            });
        }

        account.State = "Active";
        await account.save();

        await sendAccountDetailsEmail(account.Email, account);

        return res.status(200).json({
            errCode: 0,
            message: "Tài khoản đã được kích hoạt thành công.",
        });
    } catch (e) {
        console.error(e);
        return res.status(400).json({
            errCode: 1,
            message: "Liên kết xác nhận không hợp lệ hoặc đã hết hạn.",
        });
    }
};

exports.handleSignup = async (req, res) => {
    const { name, email, password, cccd, phone, address, age, gender } = req.body;

    if (!name || !email || !password || !cccd || !phone || !address || !age || !gender) {
        return res.status(500).json({
            errCode: 1,
            message: 'Các trường dữ liệu không được để trống!'
        });
    }

    try {
        const accountData = await accountService.handleUserSignup(name, email, password, cccd, phone, address, age, gender);

        if (accountData.errCode !== 0) {
            return res.status(400).json({
                errCode: accountData.errCode,
                message: accountData.errMessage,
            });
        }

        const token = jwt.sign(
            { userId: accountData.account._id, email: accountData.account.Email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            errCode: accountData.errCode,
            message: accountData.errMessage,
            account: accountData.account,
            token: token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errCode: 2,
            message: 'Lỗi server, vui lòng thử lại sau!',
        });
    }
};

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
        process.env.JWT_SECRET, 
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
    const code = req.body.code;

    try {
        if (!code) {
            return res.status(500).json({
                errCode: 1,
                message: 'Các trường dữ liệu không được để trống!'
            });
        }

        const user = await accountService.getAUserSV(code);

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

exports.limitedAccount = async (req, res) => {
    const { id, state } = req.body;
    console.log(id);
    console.log(state);

    try {
        if (!id || !state) {
            return res.status(400).json({
                errCode: 1,
                message: 'Các trường dữ liệu không được để trống!'
            });
        }

        const user = await accountService.limitedAccountSV(id, state);

        if (!user) {
            return res.status(404).json({
                errCode: 2,
                message: 'Không tìm thấy người dùng!'
            });
        } else {
            return res.status(200).json({ user });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};