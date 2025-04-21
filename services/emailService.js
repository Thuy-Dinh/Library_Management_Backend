import nodemailer from 'nodemailer';

export const sendReminderEmail = (email, loan) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Nhắc nhở trả sách đúng hạn',
        text: `
            Xin chào ${loan.AccountName},

            Đơn mượn sách mã ${loan.LoanCode} sẽ đến hạn vào ngày ${loan.DayEnd}.

            Vui lòng trả sách đúng hạn!

            Trân trọng,
            Thư viện BokStory
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log('Email sent: ' + info.response);
    });
};