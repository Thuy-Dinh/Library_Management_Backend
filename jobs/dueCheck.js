const cron = require('node-cron');
const dayjs = require('dayjs');
const Loan = require("../models/Loan");

cron.schedule('0 0 * * *', async () => {
  const today = dayjs().startOf('day');

  const borrowings = await Loan.findAll({
    where: {
      status: 'Đang mượn'
    }
  });

  for (const borrow of borrowings) {
    const dueDate = dayjs(borrow.returnDate).startOf('day');
    const diff = today.diff(dueDate, 'day');

    let message = '';
    if (diff === -1) message = `Sách "${borrow.bookTitle}" sẽ đến hạn trả vào ngày mai.`;
    else if (diff === 1) message = `Sách "${borrow.bookTitle}" đã quá hạn trả 1 ngày.`;
    else if (diff > 5 && diff <= 7) message = `Sách "${borrow.bookTitle}" đã quá hạn hơn 5 ngày.`;
    else if (diff > 7 && diff <= 30) message = `Sách "${borrow.bookTitle}" đã quá hạn hơn 7 ngày.`;
    else if (diff > 30) message = `Sách "${borrow.bookTitle}" đã quá hạn hơn 30 ngày.`;

    if (message !== '') {
      await db.Notification.create({
        title: 'Cảnh báo mượn sách',
        content: message,
        userId: borrow.adminId, // hoặc để null nếu là chung
        createdAt: new Date(),
        status: 'chưa đọc',
      });
    }
  }
});