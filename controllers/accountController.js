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

    const accountData = await accountService.handleUserLogin(email, password);
    console.log(accountData);

    // return user info
    return res.status(200).json({
        // errCode: accountData.errCode,
        // message: accountData.errMessage,
        // account: accountData.account ? accountData.account : {}
        deviceId: "8a0fc66a61a959f6",
        qrCodeId: "a652d57094b7590bdea115b156c07098abdea87",
        qrCodeValue: "P22498244182551944"
    });
}
