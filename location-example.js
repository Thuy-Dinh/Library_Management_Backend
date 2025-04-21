const mongoose = require('mongoose');
const Book = require('./models/Book');
const Category = require('./models/Category');
const dotenv = require('dotenv');

dotenv.config();
const queryString = process.env.MONGODB_URI;
mongoose.connect(queryString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Hàm lấy area theo tên category
const getAreaByCategoryName = (categoryName) => {
  if (["Classic", "Literature", "Epic", "Epic Poetry"].includes(categoryName)) {
    return "Văn học cổ điển & danh tác";
  } else if (["Fantasy", "Adventure", "Science Fiction"].includes(categoryName)) {
    return "Văn học giả tưởng & phiêu lưu";
  } else if (["Gothic Fiction", "Horror", "Post-apocalyptic"].includes(categoryName)) {
    return "Văn học huyền bí & kinh dị";
  } else if (["Philosophical Fiction", "Psychological Fiction", "Dystopian"].includes(categoryName)) {
    return "Văn học hiện sinh & triết học";
  } else if (["Romance"].includes(categoryName)) {
    return "Tình cảm & lãng mạn";
  }
  return "Văn học đa thể loại/khác";
};

// Hàm tạo vị trí ngẫu nhiên
const generateRandomLocation = () => {
  const shelves = ["A", "B", "C", "D"];
  const slots = ["1", "2", "3", "4"];

  return {
    shelf: shelves[Math.floor(Math.random() * shelves.length)],
    slot: slots[Math.floor(Math.random() * slots.length)]
  };
};

// Cập nhật sách
const updateBooks = async () => {
  try {
    const books = await Book.find().populate('Category'); // Lấy thêm thông tin Category

    for (const book of books) {
      const categoryName = book.Category?.Name || "Unknown";
      const area = getAreaByCategoryName(categoryName);
      const { shelf, slot } = generateRandomLocation();

      book.Location = {
        area,
        shelf,
        slot
      };

      await book.save();
      console.log(`✔ Đã cập nhật Location cho sách: ${book.Title}`);
    }

    console.log("✅ Đã cập nhật xong tất cả sách.");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật sách:", error);
    mongoose.disconnect();
  }
};

updateBooks();