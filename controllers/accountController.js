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
            from: `"Thư viện BokStory" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🎉 Kích hoạt tài khoản thư viện thành công!",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; color: #333;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
                            <h2>🎉 Tài khoản của bạn đã được kích hoạt!</h2>
                        </div>
                        <div style="padding: 20px;">
                            <p>Xin chào <strong>${account.Name}</strong>,</p>
                            <p>Chúc mừng! Bạn đã đăng ký thành công tài khoản tại thư viện. Dưới đây là thông tin chi tiết tài khoản của bạn:</p>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr><td style="padding: 8px;"><strong>Mã thẻ bạn đọc:</strong></td><td style="padding: 8px;">${account.LbCode}</td></tr>
                                <tr><td style="padding: 8px;"><strong>Tên:</strong></td><td style="padding: 8px;">${account.Name}</td></tr>
                                <tr><td style="padding: 8px;"><strong>Email:</strong></td><td style="padding: 8px;">${account.Email}</td></tr>
                                <tr><td style="padding: 8px;"><strong>Số CCCD:</strong></td><td style="padding: 8px;">${account.CCCDNumber}</td></tr>
                                <tr><td style="padding: 8px;"><strong>Số điện thoại:</strong></td><td style="padding: 8px;">${account.Phone}</td></tr>
                                <tr><td style="padding: 8px;"><strong>Địa chỉ:</strong></td><td style="padding: 8px;">${account.Address}</td></tr>
                                <tr><td style="padding: 8px;"><strong>Tuổi:</strong></td><td style="padding: 8px;">${account.Age}</td></tr>
                                <tr><td style="padding: 8px;"><strong>Giới tính:</strong></td><td style="padding: 8px;">${account.Gender}</td></tr>
                            </table>
                            <p style="margin-top: 20px;">Vui lòng đăng nhập để sử dụng các dịch vụ của thư viện như tra cứu sách, mượn sách, và nhiều tiện ích khác.</p>
                            <p style="margin-top: 10px;">Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>
                        </div>
                        <div style="background-color: #eeeeee; padding: 15px; text-align: center; font-size: 14px; color: #555;">
                            📚 Thư viện BokStory - Luôn đồng hành cùng tri thức của bạn.<br>
                            📧 Email: 4evershop4@gmail.com | ☎️ Hotline: 096 440 6858
                        </div>
                    </div>
                </div>
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const account = await AccountModel.findOne({ _id: decoded.userId, Email: decoded.email });

        if (!account) {
            return res.status(400).json({
                errCode: 1,
                message: "❌ Xác nhận không hợp lệ hoặc tài khoản không tồn tại. Vui lòng kiểm tra lại liên kết xác nhận trong email của bạn.",
            });
        }

        if (account.State === "Active") {
            return res.status(200).json({
                errCode: 0,
                message: "✅ Tài khoản của bạn đã được kích hoạt trước đó. Bạn có thể đăng nhập để sử dụng dịch vụ.",
            });
        }

        account.State = "Active";
        await account.save();

        // Gửi email thông báo kích hoạt thành công
        await sendAccountDetailsEmail(account.Email, account);

        return res.status(200).json({
            errCode: 0,
            message: "🎉 Tài khoản của bạn đã được kích hoạt thành công. Chúng tôi đã gửi thông tin chi tiết qua email!",
        });
    } catch (e) {
        console.error(e);
        return res.status(400).json({
            errCode: 1,
            message: "❌ Liên kết xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác nhận.",
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

exports.updateUser = async (req, res) => {
    const { userCode } = req.params;
    const updatedData = req.body;

    try {
        const user = await accountService.updateUserSV(userCode, updatedData);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.json({ message: 'Cập nhật thành công', user });
    } catch (err) {
        console.error('Lỗi cập nhật:', err.message);
        res.status(500).json({ message: 'Lỗi server khi cập nhật người dùng' });
    }
};