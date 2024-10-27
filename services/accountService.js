const AccountModel = require("../models/Account");
const bcrypt = require('bcrypt');

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

exports.handleUserLogin = async(email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let accountData = {};

            let isExist = await checkAccountEmail(email);
            console.log(isExist);
            if (isExist) {
                let account = await AccountModel.findOne(
                    { Email: email },  // Điều kiện tìm kiếm
                    { _id: 1, Email: 1, Name: 1, Password: 1 }  // Các trường bạn muốn lấy
                );                

                if (account) {
                    let check = await bcrypt.compare(password, account.Password);
                    if (check) {
                        accountData.errCode = 0;
                        accountData.errMessage = 'Ok';

                        accountData.account = account;
                    } else {
                        accountData.errCode = 3;
                        accountData.errMessage = 'Sai mật khẩu';
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
