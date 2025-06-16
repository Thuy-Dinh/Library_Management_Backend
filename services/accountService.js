const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const AccountModel = require("../models/Account");

let checkAccountEmail = (accountEmail) => {
    console.log(accountEmail);
    return new Promise(async (resolve, reject) => {
        try {
            let account = await AccountModel.findOne({ Email: accountEmail });

            console.log(account);

            if (account) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

const sendConfirmationEmail = async (email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.GMAIL_APP_PASSWORD, 
        },
    });

    const url = "https://library-management-e8767.web.app/confirm";
    await transporter.sendMail({
        from: `"Thư viện BokStory" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "📩 Xác nhận tài khoản của bạn",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0f2f5; color: #333;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <div style="background-color: #007BFF; color: white; padding: 20px; text-align: center;">
                        <h2>🔐 Xác nhận tài khoản của bạn</h2>
                    </div>
                    <div style="padding: 25px;">
                        <p>Xin chào,</p>
                        <p>Bạn vừa đăng ký tài khoản tại <strong>Thư viện BokStory</strong>. Vui lòng xác nhận tài khoản của bạn bằng cách nhấn vào nút bên dưới:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${url}" 
                               style="background-color: #28a745; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                               ✅ Xác nhận tài khoản
                            </a>
                        </div>
    
                        <p>Nếu bạn không yêu cầu đăng ký tài khoản, vui lòng bỏ qua email này.</p>
                        <p>Liên kết sẽ hết hạn sau một thời gian nhất định để đảm bảo bảo mật thông tin.</p>
                    </div>
                    <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 13px; color: #666;">
                        📚 Thư viện BokStory<br>
                        Mọi thắc mắc vui lòng liên hệ: 4evershop4@gmail.com | 096 440 6858
                    </div>
                </div>
            </div>
        `
    });    
};

exports.handleUserSignup = async (name, email, password, cccd, phone, address, age, gender) => {
    try {
        let accountData = {};

        let isExist = await AccountModel.findOne({ Email: email });
        if (isExist) {
            accountData.errCode = 1;
            accountData.errMessage = "Email đã tồn tại. Hãy thử email khác.";
            return accountData;
        }

        let maxAccount = await AccountModel.findOne().sort({ AccountID: -1 }).exec();
        let newAccountID = maxAccount ? maxAccount.AccountID + 1 : 1;
        let hashedPassword = await bcrypt.hash(password, 10);

        let nameInitials = name.match(/\b\w/g).join('').toUpperCase(); 
        let lastFiveCCCD = cccd.slice(-5); 
        let lbCode = nameInitials + lastFiveCCCD; 

        let newAccount = await AccountModel.create({
            AccountID: newAccountID,
            Email: email,
            Name: name,
            Password: hashedPassword,
            CCCDNumber: cccd,
            Phone: phone,
            Address: address,
            Age: age,
            Gender: gender,
            LbCode: lbCode,
            Role: "user",
            State: "Request",
        });

        const token = jwt.sign(
            { userId: newAccount._id, email: newAccount.Email },
            'your_secret_key',
            { expiresIn: '1h' }
        );

        await sendConfirmationEmail(email, token);

        accountData.errCode = 0;
        accountData.errMessage = "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.";
        accountData.account = newAccount;

        return accountData;

    } catch (e) {
        console.error(e);
        return {
            errCode: 2,
            errMessage: "Lỗi server, vui lòng thử lại sau!",
        };
    }
};

exports.handleUserLogin = async(email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accountData = {};

            let isExist = await checkAccountEmail(email);
            if (isExist) {
                let account = await AccountModel.findOne(
                    { Email: email },  // Điều kiện tìm kiếm
                    { _id: 1, Email: 1, Name: 1, Password: 1, Role: 1, State: 1, LbCode: 1 }  // Các trường bạn muốn lấy
                );                

                if (account) {
                    if(account.State === "UnActive") {
                        accountData.errCode = 5;
                        accountData.errMessage = 'Tài khoản đã bị khóa';
                    } else if(account.State === "Request") {
                        accountData.errCode = 4;
                        accountData.errMessage = 'Tài khoản chưa xác thực email. Vui lòng kiểm tra lại';
                    } else {
                        let check = await bcrypt.compare(password, account.Password);
                        if (check) {
                            accountData.errCode = 0;
                            accountData.errMessage = 'Ok';
    
                            accountData.account = account;
                        } else {
                            accountData.errCode = 3;
                            accountData.errMessage = 'Sai mật khẩu';
                        }
                    }
                } else {
                    accountData.errCode = 2;
                    accountData.errMessage = `Người dùng không hợp lệ`;
                }
            } else {
                accountData.errCode = 1;
                accountData.errMessage = `Email không tồn tại. Hãy thử email khác`;
            }

            resolve(accountData);
        } catch (e) {
            reject(e);
        }
    });
}

exports.getAllUserSV = async() => {
    return AccountModel.find({Role: 'user'});
}

exports.getAUserSV = async(code) => {
    const user = await AccountModel.findOne({ LbCode: code });
    if(!user) {
        return await AccountModel.findOne({ _id: code });
    }

    return user;
}

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};

exports.limitedAccountSV = async (id, state) => { 
    const user = await AccountModel.findById(id);
    if (!user) {
        return null;
    }

    let subject = "";
    let html = "";

    if (state === "limited") {
        user.State = "Limited";
        subject = "⚠️ Tài khoản của bạn đã bị giới hạn quyền mượn sách";
        html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fdf1f0;">
                <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #d9534f;">📛 Tài khoản bị giới hạn</h2>
                    <p>Xin chào <strong>${user.Name}</strong>,</p>
                    <p>Tài khoản của bạn hiện đang ở trạng thái <strong>bị giới hạn</strong>, do đó bạn <strong>không thể mượn sách tại thư viện</strong> trong thời gian này.</p>
                    <p>Nếu bạn có bất kỳ thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ thư viện để được giải đáp:</p>
                    <ul>
                        <li>📧 Email: 4evershop4@gmail.com</li>
                        <li>☎️ Hotline: 096 440 6858</li>
                    </ul>
                    <p style="margin-top: 20px;">Cảm ơn bạn đã sử dụng dịch vụ của thư viện.</p>
                </div>
            </div>
        `;
    } else if (state === "unActive") {
        user.State = "UnActive";
        subject = "🚫 Tài khoản của bạn đã bị khóa";
        html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fef5e7;">
                <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #f39c12;">🔒 Tài khoản bị khóa</h2>
                    <p>Xin chào <strong>${user.Name}</strong>,</p>
                    <p>Tài khoản của bạn đã bị <strong>khóa tạm thời</strong> và bạn sẽ không thể truy cập vào hệ thống thư viện trong thời gian này.</p>
                    <p>Nếu đây là nhầm lẫn hoặc bạn cần hỗ trợ mở khóa, vui lòng liên hệ với thư viện qua:</p>
                    <ul>
                        <li>📧 Email: 4evershop4@gmail.com</li>
                        <li>☎️ Hotline: 096 440 6858</li>
                    </ul>
                    <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
                </div>
            </div>
        `;
    } else if (state === "active") {
        user.State = "Active";
        subject = "✅ Tài khoản của bạn đã được mở khóa";
        html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #eafaf1;">
                <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #28a745;">🎉 Tài khoản đã được kích hoạt lại</h2>
                    <p>Xin chào <strong>${user.Name}</strong>,</p>
                    <p>Chúc mừng! Tài khoản của bạn đã được <strong>mở khóa</strong> và có thể sử dụng lại như bình thường.</p>
                    <p>Hãy đăng nhập vào hệ thống để tiếp tục mượn sách, tra cứu tài liệu và sử dụng các dịch vụ khác từ thư viện.</p>
                    <p style="margin-top: 20px;">Cảm ơn bạn đã đồng hành cùng thư viện.</p>
                </div>
            </div>
        `;
    } else {
        throw new Error("Trạng thái không hợp lệ!");
    }

    await user.save(); // Lưu thay đổi vào database

    // Gửi email thông báo HTML
    await sendEmail(user.Email, subject, html);

    return user;
};

exports.updateUserSV = async (userCode, updatedData) => {
    return await AccountModel.findOneAndUpdate(
        { LbCode: userCode },
        { $set: updatedData },
        { new: true }
    );
};