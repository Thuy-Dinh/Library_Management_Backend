const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Area = require('./models/Area');
const Category = require('./models/Category');

dotenv.config();

const topicToAreaName = (topic) => {
  if (["Classic", "Literature", "Epic", "Epic Poetry"].includes(topic)) {
    return "Văn học cổ điển & danh tác";
  } else if (["Fantasy", "Adventure", "Science Fiction"].includes(topic)) {
    return "Văn học giả tưởng & phiêu lưu";
  } else if (["Gothic Fiction", "Horror", "Post-apocalyptic"].includes(topic)) {
    return "Văn học huyền bí & kinh dị";
  } else if (["Philosophical Fiction", "Psychological Fiction", "Dystopian"].includes(topic)) {
    return "Văn học hiện sinh & triết học";
  } else if (["Romance"].includes(topic)) {
    return "Tình cảm & lãng mạn";
  }
  return "Văn học đa thể loại/khác";
};
const queryString = process.env.MONGODB_URI;
const seedAreas = async () => {
  await mongoose.connect(queryString);

  const categories = await Category.find(); // Lấy tất cả topics
  const areaMap = {};

  categories.forEach(cat => {
    const areaName = topicToAreaName(cat.Name);
    if (!areaMap[areaName]) {
      areaMap[areaName] = [];
    }
    areaMap[areaName].push(cat._id);
  });

  // Xoá dữ liệu cũ (tuỳ chọn)
  await Area.deleteMany({});

  // Tạo lại Area
  for (const [name, topicIds] of Object.entries(areaMap)) {
    await Area.create({
      Name: name,
      Topics: topicIds
    });
  }

  console.log("Đã tạo dữ liệu khu vực thành công!");
  mongoose.disconnect();
};

seedAreas().catch(console.error);