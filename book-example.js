const mongoose = require('mongoose');
const Book = require('./models/Book'); 
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const books = [
  {
    BookID: 21,
    BookCode: "DMPLK1941",
    Title: "Dế Mèn Phiêu Lưu Ký",
    Author: "Tô Hoài",
    Category: "6810af7b348719fbf4e08d93",
    Subcategory: "Văn học thiếu nhi",
    Tag: "phiêu lưu, thiếu nhi",
    Publisher: "NXB Kim Đồng",
    Publication_year: 1941,
    Edition: "Đầu",
    Summary: "Cuộc phiêu lưu kỳ thú của chú dế mèn tinh nghịch và lòng trắc ẩn.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.7,
    Cover: "https://bavi.edu.vn/upload/21768/fck/files/150800018_3868030666550251_8375198552020103317_n.jpg",
    CountBorrow: 120,
    Price: "35000",
    Location: { area: "Văn học cổ điển & danh tác", shelf: "A", slot: "3" }
  },
  {
    BookID: 22,
    BookCode: "TTDGBN2016",
    Title: "Tuổi Trẻ Đáng Giá Bao Nhiêu?",
    Author: "Rosie Nguyễn",
    Category: "6810af7b348719fbf4e08d94",
    Subcategory: "Kỹ năng sống",
    Tag: "định hướng, phát triển bản thân",
    Publisher: "NXB Hội Nhà Văn",
    Publication_year: 2016,
    Edition: "Hai",
    Summary: "Lời khuyên sâu sắc dành cho người trẻ trong hành trình tìm kiếm giá trị bản thân.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.5,
    Cover: "https://nld.mediacdn.vn/2018/3/24/sach-1521858607292758740290.jpg",
    CountBorrow: 95,
    Price: "62000",
    Location: { area: "Văn học hiện sinh & triết học", shelf: "A", slot: "7" }
  },
  {
    BookID: 23,
    BookCode: "DNT1936",
    Title: "Đắc Nhân Tâm",
    Author: "Dale Carnegie",
    Category: "6810af7b348719fbf4e08d94",
    Subcategory: "Kỹ năng giao tiếp",
    Tag: "thành công, giao tiếp",
    Publisher: "NXB Tổng Hợp TP.HCM",
    Publication_year: 1936,
    Edition: "Mười",
    Summary: "Bí quyết chinh phục lòng người và nghệ thuật ứng xử hàng ngày.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.8,
    Cover: "https://firstnews.vn/upload/products/original/-1726814978.jpg",
    CountBorrow: 210,
    Price: "85000",
    Location: { area: "Văn học hiện sinh & triết học", shelf: "A", slot: "5" }
  },
  {
    BookID: 24,
    BookCode: "CTXMVDTT2008",
    Title: "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
    Author: "Nguyễn Nhật Ánh",
    Category: "6810af7b348719fbf4e08d93",
    Subcategory: "Tiểu thuyết",
    Tag: "tuổi thơ, hài hước",
    Publisher: "NXB Trẻ",
    Publication_year: 2008,
    Edition: "Đầu",
    Summary: "Hồi tưởng ngọt ngào và hóm hỉnh về tuổi thơ tươi đẹp.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.6,
    Cover: "https://www.nxbtre.com.vn/Images/Book/nxbtre_full_09422022_034212.jpg",
    CountBorrow: 130,
    Price: "49000",
    Location: { area: "Văn học cổ điển & danh tác", shelf: "A", slot: "2" }
  },
  {
    BookID: 25,
    BookCode: "BG1969",
    Title: "Bố Già",
    Author: "Mario Puzo",
    Category: "6810af7b348719fbf4e08d95",
    Subcategory: "Tiểu thuyết nước ngoài",
    Tag: "mafia, quyền lực",
    Publisher: "NXB Văn Học",
    Publication_year: 1969,
    Edition: "Ba",
    Summary: "Cuộc sống và quyền lực trong thế giới ngầm của gia đình mafia Corleone.",
    Language: "Tiếng Việt",
    Availability: "borrowed",
    Rating: 4.9,
    Cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-EYGGYN0O8LBBsrnTHXsvoncvb4O_KbCxsQ&s",
    CountBorrow: 165,
    Price: "98000",
    Location: { area: "Văn học huyền bí & kinh dị", shelf: "A", slot: "1" }
  },
  {
    BookID: 26,
    BookCode: "NGK1988",
    Title: "Nhà Giả Kim",
    Author: "Paulo Coelho",
    Category: "6810af7b348719fbf4e08d94",
    Subcategory: "Triết lý sống",
    Tag: "hành trình, số phận",
    Publisher: "NXB Lao Động",
    Publication_year: 1988,
    Edition: "Bốn",
    Summary: "Hành trình của chàng chăn cừu Santiago đi tìm kho báu, và gặp chính mình.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 0,
    Cover: "https://upload.wikimedia.org/wikipedia/vi/9/9c/Nh%C3%A0_gi%E1%BA%A3_kim_%28s%C3%A1ch%29.jpg",
    CountBorrow: 155,
    Price: "70000",
    Location: { area: "Văn học hiện sinh & triết học", shelf: "A", slot: "6" }
  },
  {
    BookID: 27,
    BookCode: "T-CBCS1981",
    Title: "Totto-Chan Bên Cửa Sổ",
    Author: "Tetsuko Kuroyanagi",
    Category: "6810af7b348719fbf4e08d93",
    Subcategory: "Giáo dục",
    Tag: "trẻ em, giáo dục",
    Publisher: "NXB Hội Nhà Văn",
    Publication_year: 1981,
    Edition: "Đầu",
    Summary: "Câu chuyện cảm động về một cô bé hiếu động và ngôi trường đặc biệt.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 0,
    Cover: "https://upload.wikimedia.org/wikipedia/vi/f/fb/Totto-chan_b%C3%AAn_c%E1%BB%ADa_s%E1%BB%95_%28s%C3%A1ch%29.jpg",
    CountBorrow: 88,
    Price: "54000",
    Location: { area: "Văn học cổ điển & danh tác", shelf: "A", slot: "4" }
  },
  {
    BookID: 28,
    BookCode: "NTTDV2003",
    Title: "Người Truy Tìm Dấu Vết",
    Author: "Max Allan Collins",
    Category: "68060f9f091bb1f695a65f8c",
    Subcategory: "Trinh thám",
    Tag: "tội phạm, điều tra",
    Publisher: "NXB Văn Học",
    Publication_year: 2003,
    Edition: "Đầu",
    Summary: "Những cuộc điều tra ly kỳ và bất ngờ.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 0,
    Cover: "https://cdn1.fahasa.com/media/flashmagazine/images/page_images/nguoi_truy_tim_dau_vet/2021_08_27_10_54_10_1-390x510.jpg",
    CountBorrow: 76,
    Price: "63000",
    Location: { area: "Văn học huyền bí & kinh dị", shelf: "A", slot: "8" }
  },
  {
    BookID: 29,
    BookCode: "S:LSLN2011",
    Title: "Sapiens: Lược Sử Loài Người",
    Author: "Yuval Noah Harari",
    Category: "68060f9f091bb1f695a65f8f",
    Subcategory: "Lịch sử",
    Tag: "lịch sử, khoa học",
    Publisher: "NXB Dân Trí",
    Publication_year: 2011,
    Edition: "Hai",
    Summary: "Hành trình phát triển của loài người từ thời sơ khai đến hiện đại.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 0,
    Cover: "https://bizweb.dktcdn.net/100/197/269/products/sapiens-luoc-su-ve-loai-nguoi-outline-5-7-2017-02.jpg?v=1520935327270",
    CountBorrow: 123,
    Price: "125000",
    Location: { area: "Văn học cổ điển & danh tác", shelf: "A", slot: "1" }
  },
  {
    BookID: 30,
    BookCode: "HVTT2010",
    Title: "Hiểu Về Trái Tim",
    Author: "Minh Niệm",
    Category: "68060f9f091bb1f695a65f8c",
    Subcategory: "Thiền - Tâm lý",
    Tag: "thiền, tâm hồn",
    Publisher: "NXB Trẻ",
    Publication_year: 2010,
    Edition: "Đầu",
    Summary: "Cuốn sách chữa lành tâm hồn thông qua sự hiểu biết và thiền định.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 0,
    Cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1473045794i/13640125.jpg",
    CountBorrow: 198,
    Price: "78000",
    Location: { area: "Văn học hiện sinh & triết học", shelf: "A", slot: "9" }
  } 
];

async function seedBooks() {
  try {
    await Book.insertMany(books); // 👈 Thêm dữ liệu, KHÔNG xóa cũ
    console.log("✅ Đã thêm sách mới vào cơ sở dữ liệu!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Lỗi khi thêm sách:", err);
    mongoose.connection.close();
  }
}

seedBooks();