// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// // Kết nối tới MongoDB
// dotenv.config();
// const queryString = process.env.MONGODB_URI;

// mongoose.connect(queryString, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   tlsInsecure: true
// })
//   .then(() => console.log('MongoDB connected!'))
//   .catch((err) => console.log('MongoDB connection error:', err.message));

// // Import Models
// const Book = require('./models/Book');
// const Category = require('./models/Category');

// // Dữ liệu sách
// const additionalBookData = [
//   {
//     BookID: 1,
//     Title: "The Hobbit",
//     Author: "J.R.R. Tolkien",
//     Topic: "Fantasy",
//     Subcategory: "Adventure",
//     Tag: "Fiction",
//     Publisher: "George Allen & Unwin",
//     Publication_year: 1937,
//     Edition: "First",
//     Summary: "A hobbit's journey to reclaim a lost kingdom and treasure.",
//     Language: "English",
//     Availability: "Available",
//     Rating: 4.7,
//     Cover: "https://s3.amazonaws.com/gs-geo-images/cd76c55b-9830-44d9-8596-95678d41b7cf.jpg",
//     CountBorrow: 250,
//     Price: 150000
//   },
//   {
//     BookID: 2,
//     Title: "Crime and Punishment",
//     Author: "Fyodor Dostoevsky",
//     Topic: "Psychological Fiction",
//     Subcategory: "Classic",
//     Tag: "Fiction",
//     Publisher: "The Russian Messenger",
//     Publication_year: 1866,
//     Edition: "First",
//     Summary: "A young man grapples with guilt after committing murder.",
//     Language: "Russian",
//     Availability: "Unavailable",
//     Rating: 4.5,
//     Cover: "https://m.media-amazon.com/images/I/71O2XIytdqL._AC_UF1000,1000_QL80_.jpg",
//     CountBorrow: 130,
//     Price: 180000
//   },
//   {
//     BookID: 3,
//     Title: "The Divine Comedy",
//     Author: "Dante Alighieri",
//     Topic: "Epic Poetry",
//     Subcategory: "Classic",
//     Tag: "Fiction",
//     Publisher: "John Murray",
//     Publication_year: 1320,
//     Edition: "First",
//     Summary: "An epic journey through Hell, Purgatory, and Heaven.",
//     Language: "Italian",
//     Availability: "Available",
//     Rating: 4.6,
//     Cover: "https://m.media-amazon.com/images/I/51i-9SGWr-L._AC_UF1000,1000_QL80_.jpg",
//     CountBorrow: 85,
//     Price: 200000
//   },
//   {
//     BookID: 4,
//     Title: "Anna Karenina",
//     Author: "Leo Tolstoy",
//     Topic: "Literature",
//     Subcategory: "Classic",
//     Tag: "Fiction",
//     Publisher: "The Russian Messenger",
//     Publication_year: 1878,
//     Edition: "First",
//     Summary: "A tragic story of love and betrayal in Russian aristocracy.",
//     Language: "Russian",
//     Availability: "Available",
//     Rating: 4.7,
//     Cover: "https://peribo.com.au/wp-content/uploads/9781853262715-15.jpg",
//     CountBorrow: 90,
//     Price: 175000
//   },
//   {
//     BookID: 5,
//     Title: "The Odyssey",
//     Author: "Homer",
//     Topic: "Epic",
//     Subcategory: "Ancient Greek Literature",
//     Tag: "Fiction",
//     Publisher: "Various",
//     Publication_year: -800,
//     Edition: "First",
//     Summary: "The journey of Odysseus back home after the Trojan War.",
//     Language: "Greek",
//     Availability: "Available",
//     Rating: 4.4,
//     Cover: "https://m.media-amazon.com/images/I/A1JR2oK-orL._AC_UF1000,1000_QL80_.jpg",
//     CountBorrow: 120,
//     Price: 160000
//   },
//   {
//     BookID: 6,
//     Title: "The Brothers Karamazov",
//     Author: "Fyodor Dostoevsky",
//     Topic: "Philosophical Fiction",
//     Subcategory: "Classic",
//     Tag: "Fiction",
//     Publisher: "The Russian Messenger",
//     Publication_year: 1880,
//     Edition: "First",
//     Summary: "A complex tale of faith, doubt, and family conflict.",
//     Language: "Russian",
//     Availability: "Unavailable",
//     Rating: 4.8,
//     Cover: "https://m.media-amazon.com/images/I/71OZJsgZzQL._AC_UF1000,1000_QL80_.jpg",
//     CountBorrow: 95,
//     Price: 190000
//   },
//   {
//     BookID: 7,
//     Title: "Frankenstein",
//     Author: "Mary Shelley",
//     Topic: "Gothic Fiction",
//     Subcategory: "Science Fiction",
//     Tag: "Fiction",
//     Publisher: "Lackington, Hughes, Harding, Mavor & Jones",
//     Publication_year: 1818,
//     Edition: "First",
//     Summary: "A scientist creates a monster that turns against him.",
//     Language: "English",
//     Availability: "Available",
//     Rating: 4.3,
//     Cover: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781982146160/frankenstein-9781982146160_hr.jpg",
//     CountBorrow: 175,
//     Price: 145000
//   },
//   {
//     BookID: 8,
//     Title: "Jane Eyre",
//     Author: "Charlotte Brontë",
//     Topic: "Romance",
//     Subcategory: "Classic",
//     Tag: "Fiction",
//     Publisher: "Smith, Elder & Co.",
//     Publication_year: 1847,
//     Edition: "First",
//     Summary: "The story of an orphaned girl and her journey to independence.",
//     Language: "English",
//     Availability: "Available",
//     Rating: 4.6,
//     Cover: "https://m.media-amazon.com/images/I/61N-UOA0alL._UF1000,1000_QL80_.jpg",
//     CountBorrow: 145,
//     Price: 165000
//   },
//   {
//     BookID: 9,
//     Title: "Fahrenheit 451",
//     Author: "Ray Bradbury",
//     Topic: "Dystopian",
//     Subcategory: "Science Fiction",
//     Tag: "Fiction",
//     Publisher: "Ballantine Books",
//     Publication_year: 1953,
//     Edition: "First",
//     Summary: "A dystopian future where books are banned and burned.",
//     Language: "English",
//     Availability: "Available",
//     Rating: 4.5,
//     Cover: "https://upload.wikimedia.org/wikipedia/en/d/db/Fahrenheit_451_1st_ed_cover.jpg",
//     CountBorrow: 180,
//     Price: 185000
//   },
//   {
//     BookID: 10,
//     Title: "Dracula",
//     Author: "Bram Stoker",
//     Topic: "Horror",
//     Subcategory: "Gothic Fiction",
//     Tag: "Fiction",
//     Publisher: "Archibald Constable and Company",
//     Publication_year: 1897,
//     Edition: "First",
//     Summary: "The story of the vampire Count Dracula's attempt to spread undead curse.",
//     Language: "English",
//     Availability: "Available",
//     Rating: 4.5,
//     Cover: "https://m.media-amazon.com/images/I/91wOUFZCE+L._UF1000,1000_QL80_.jpg",
//     CountBorrow: 160,
//     Price: 175000
//   },
//   {
//     BookID: 11,
//     Title: "To Kill a Mockingbird",
//     Author: "Harper Lee",
//     Topic: "Classic",
//     Subcategory: "Literature",
//     Tag: "Fiction",
//     Publisher: "J.B. Lippincott & Co.",
//     Publication_year: 1960,
//     Edition: "First",
//     Summary: "A story of racial injustice in the Deep South.",
//     Language: "English",
//     Availability: "Available",
//     Rating: 4.8,
//     Cover: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
//     CountBorrow: 300,
//     Price: 195000
//   },
//   {
//     BookID: 12,
//     Title: "1984",
//     Author: "George Orwell",
//     Topic: "Dystopian",
//     Subcategory: "Political Fiction",
//     Tag: "Fiction",
//     Publisher: "Secker & Warburg",
//     Publication_year: 1949,
//     Edition: "First",
//     Summary: "A dystopian future under totalitarian surveillance.",
//     Language: "English",
//     Availability: "Available",
//     Rating: 4.6,
//     Cover: "https://cdn.waterstones.com/bookjackets/large/9780/1410/9780141036144.jpg",
//     CountBorrow: 280,
//     Price: 175000
//   },
//   {
//     BookID: 13,
//     Title: "Pride and Prejudice",
//     Author: "Jane Austen",
//     Topic: "Romance",
//     Subcategory: "Classic",
//     Tag: "Fiction",
//     Publisher: "T. Egerton",
//     Publication_year: 1813,
//     Edition: "First",
//     Summary: "A witty commentary on class and marriage in 19th century England.",
//     Language: "English",
//     Availability: "Available",
//     Rating: 4.7,
//     Cover: "https://m.media-amazon.com/images/I/91uwocAMtSL._AC_UF1000,1000_QL80_.jpg",
//     CountBorrow: 250,
//     Price: 185000
//   },
//   {
//     BookID: 14,
//     Title: "Moby-Dick",
//     Author: "Herman Melville",
//     Topic: "Adventure",
//     Subcategory: "Sea Stories",
//     Tag: "Fiction",
//     Publisher: "Harper & Brothers",
//     Publication_year: 1851,
//     Edition: "First",
//     Summary: "A quest for vengeance against the white whale, Moby-Dick.",
//     Language: "English",
//     Availability: "Unavailable",
//     Rating: 4.4,
//     Cover: "https://m.media-amazon.com/images/I/51aV053NRjL._AC_UF1000,1000_QL80_.jpg",
//     CountBorrow: 200,
//     Price: 160000
//   },
//   {
//     BookID: 15,
//     Title: "The Great Gatsby",
//     Author: "F. Scott Fitzgerald",
//     Topic: "Classic",
//     Subcategory: "Tragedy",
//     Tag: "Fiction",
//     Publisher: "Charles Scribner's Sons",
//     Publication_year: 1925,
//     Edition: "First",
//     Summary: "A tragic story of wealth and unattainable love in the Jazz Age.",
//     Language: "English",
//     Availability: "Available",
//     Rating: 4.6,
//     Cover: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg",
//     CountBorrow: 260,
//     Price: 170000
//   },
//   {
//     BookID: 16,
//     Title: "Brave New World",
//     Author: "Aldous Huxley",
//     Topic: "Science Fiction",
//     Subcategory: "Dystopian",
//     Tag: "Fiction",
//     Publisher: "Chatto & Windus",
//     Publication_year: 1932,
//     Edition: "First",
//     Summary: "A dystopian future driven by technological advances and social control.",
//     Language: "English",
//     Availability: "Available",
//     Rating: 4.5,
//     Cover: "https://upload.wikimedia.org/wikipedia/en/6/62/BraveNewWorld_FirstEdition.jpg",
//     CountBorrow: 240,
//     Price: 180000
//   },
//   {
//     BookID: 17,
//     Title: "The Catcher in the Rye",
//     Author: "J.D. Salinger",
//     Topic: "Classic",
//     Subcategory: "Literature",
//     Tag: "Fiction",
//     Publisher: "Little, Brown and Company",
//     Publication_year: 1951,
//     Edition: "First",
//     Summary: "A young man's journey through alienation and rebellion.",
//     Language: "English",
//     Availability: "Available",
//     Rating: 4.2,
//     Cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKbLoG01sx1LqNYQjsB5mNwZVPjN71J5i6w&s",
//     CountBorrow: 220,
//     Price: 165000
//   },
//   {
//     BookID: 18,
//     Title: "The Road",
//     Author: "Cormac McCarthy",
//     Topic: "Post-apocalyptic",
//     Subcategory: "Survival",
//     Tag: "Fiction",
//     Publisher: "Alfred A. Knopf",
//     Publication_year: 2006,
//     Edition: "First",
//     Summary: "A father and son's journey through a bleak, post-apocalyptic world.",
//     Language: "English",
//     Availability: "Unavailable",
//     Rating: 4.3,
//     Cover: "https://m.media-amazon.com/images/I/51M7XGLQTBL._AC_UF894,1000_QL80_.jpg",
//     CountBorrow: 180,
//     Price: 195000
//   },
//   {
//     BookID: 19,
//     Title: "Don Quixote",
//     Author: "Miguel de Cervantes",
//     Topic: "Classic",
//     Subcategory: "Adventure",
//     Tag: "Fiction",
//     Publisher: "Francisco de Robles",
//     Publication_year: 1605,
//     Edition: "First",
//     Summary: "The adventures of an idealistic knight and his loyal squire.",
//     Language: "Spanish",
//     Availability: "Available",
//     Rating: 4.6,
//     Cover: "https://bookowlsbd.com/cdn/shop/files/Don-Quixote-COVER.jpg?v=1723967636",
//     CountBorrow: 230,
//     Price: 200000
//   },
//   {
//     BookID: 20,
//     Title: "The Count of Monte Cristo",
//     Author: "Alexandre Dumas",
//     Topic: "Adventure",
//     Subcategory: "Revenge",
//     Tag: "Fiction",
//     Publisher: "Pierre-Jules Hetzel",
//     Publication_year: 1844,
//     Edition: "First",
//     Summary: "A tale of betrayal and ultimate revenge.",
//     Language: "French",
//     Availability: "Available",
//     Rating: 4.8,
//     Cover: "https://m.media-amazon.com/images/I/71zcCb5PvuL._UF1000,1000_QL80_.jpg",
//     CountBorrow: 270,
//     Price: 220000
//   }

// ];

// function generateBookCode(book) {
//   const removeDiacritics = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
//   const getAcronym = (title) => {
//       return removeDiacritics(title)
//           .split(/\s+/) // Tách các từ
//           .map(word => word[0]?.toUpperCase()) // Lấy chữ cái đầu
//           .join(""); // Ghép lại
//   };

//   return `${getAcronym(book.Title)}${book.Publication_year}`;
// }

// const updatedBookData = additionalBookData.map(book => ({
//   ...book,
//   BookCode: generateBookCode(book)
// }));

// // Quá trình làm mới dữ liệu
// const refreshDatabase = async () => {
//   try {
//     // Xóa dữ liệu hiện có
//     await Book.deleteMany({});
//     await Category.deleteMany({});
//     console.log('All books and categories deleted!');

//     // Tạo danh mục từ dữ liệu sách
//     const topics = [...new Set(updatedBookData.map(book => book.Topic))];
//     const categories = await Category.insertMany(
//       topics.map(topic => ({
//         Name: topic,
//         Quantity: 0 // Cập nhật sau
//       }))
//     );

//     // Tạo map Topic -> CategoryID
//     const topicToCategoryMap = {};
//     categories.forEach(category => {
//       topicToCategoryMap[category.Name] = category._id;
//     });

//     // Cập nhật dữ liệu sách
//     const booksWithCategory = updatedBookData.map(book => ({
//       ...book,
//       Category: topicToCategoryMap[book.Topic]
//     }));

//     await Book.insertMany(booksWithCategory);
//     console.log('Books and categories refreshed successfully!');

//     // Cập nhật số lượng sách trong mỗi Category
//     for (const category of categories) {
//       const count = booksWithCategory.filter(book => book.Category.equals(category._id)).length;
//       await Category.findByIdAndUpdate(category._id, { Quantity: count });
//     }

//     console.log('Category quantities updated successfully!');
//   } catch (error) {
//     console.error('Error refreshing database:', error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// // Thực thi
// refreshDatabase();

const mongoose = require('mongoose');
const Book = require('./models/Book'); 
require('dotenv').config(); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const books = [
  {
    BookID: 21,
    BookCode: "TV001",
    Title: "Dế Mèn Phiêu Lưu Ký",
    Author: "Tô Hoài",
    Category: "6810af7b348719fbf4e08d93",
    Subcategory: "Văn học thiếu nhi",
    Tag: "phiêu lưu, thiếu nhi",
    Publisher: "NXB Kim Đồng",
    Publication_year: 1941,
    Edition: "1",
    Summary: "Cuộc phiêu lưu kỳ thú của chú dế mèn tinh nghịch và lòng trắc ẩn.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.7,
    Cover: "https://example.com/de-men.jpg",
    CountBorrow: 120,
    Price: "35000",
    Location: { area: "A", shelf: "1", slot: "3" }
  },
  {
    BookID: 22,
    BookCode: "TV002",
    Title: "Tuổi Trẻ Đáng Giá Bao Nhiêu?",
    Author: "Rosie Nguyễn",
    Category: "660e4c85a9df5c25b8839db2",
    Subcategory: "Kỹ năng sống",
    Tag: "định hướng, phát triển bản thân",
    Publisher: "NXB Hội Nhà Văn",
    Publication_year: 2016,
    Edition: "2",
    Summary: "Lời khuyên sâu sắc dành cho người trẻ trong hành trình tìm kiếm giá trị bản thân.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.5,
    Cover: "https://example.com/tuoi-tre.jpg",
    CountBorrow: 95,
    Price: "62000",
    Location: { area: "B", shelf: "3", slot: "7" }
  },
  {
    BookID: 23,
    BookCode: "TV003",
    Title: "Đắc Nhân Tâm",
    Author: "Dale Carnegie",
    Category: "660e4c85a9df5c25b8839db3",
    Subcategory: "Kỹ năng giao tiếp",
    Tag: "thành công, giao tiếp",
    Publisher: "NXB Tổng Hợp TP.HCM",
    Publication_year: 1936,
    Edition: "10",
    Summary: "Bí quyết chinh phục lòng người và nghệ thuật ứng xử hàng ngày.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.8,
    Cover: "https://example.com/dac-nhan-tam.jpg",
    CountBorrow: 210,
    Price: "85000",
    Location: { area: "C", shelf: "2", slot: "5" }
  },
  {
    BookID: 24,
    BookCode: "TV004",
    Title: "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
    Author: "Nguyễn Nhật Ánh",
    Category: "660e4c85a9df5c25b8839db1",
    Subcategory: "Tiểu thuyết",
    Tag: "tuổi thơ, hài hước",
    Publisher: "NXB Trẻ",
    Publication_year: 2008,
    Edition: "1",
    Summary: "Hồi tưởng ngọt ngào và hóm hỉnh về tuổi thơ tươi đẹp.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.6,
    Cover: "https://example.com/tuoi-tho.jpg",
    CountBorrow: 130,
    Price: "49000",
    Location: { area: "D", shelf: "4", slot: "2" }
  },
  {
    BookID: 25,
    BookCode: "TV005",
    Title: "Bố Già",
    Author: "Mario Puzo",
    Category: "660e4c85a9df5c25b8839db4",
    Subcategory: "Tiểu thuyết nước ngoài",
    Tag: "mafia, quyền lực",
    Publisher: "NXB Văn Học",
    Publication_year: 1969,
    Edition: "3",
    Summary: "Cuộc sống và quyền lực trong thế giới ngầm của gia đình mafia Corleone.",
    Language: "Tiếng Việt",
    Availability: "borrowed",
    Rating: 4.9,
    Cover: "https://example.com/bo-gia.jpg",
    CountBorrow: 165,
    Price: "98000",
    Location: { area: "E", shelf: "5", slot: "1" }
  },
  {
    BookID: 26,
    BookCode: "TV006",
    Title: "Nhà Giả Kim",
    Author: "Paulo Coelho",
    Category: "660e4c85a9df5c25b8839db4",
    Subcategory: "Triết lý sống",
    Tag: "hành trình, số phận",
    Publisher: "NXB Lao Động",
    Publication_year: 1988,
    Edition: "4",
    Summary: "Hành trình của chàng chăn cừu Santiago đi tìm kho báu, và gặp chính mình.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.6,
    Cover: "https://example.com/nha-gia-kim.jpg",
    CountBorrow: 155,
    Price: "70000",
    Location: { area: "F", shelf: "6", slot: "6" }
  },
  {
    BookID: 27,
    BookCode: "TV007",
    Title: "Totto-Chan Bên Cửa Sổ",
    Author: "Tetsuko Kuroyanagi",
    Category: "6810af7b348719fbf4e08d93",
    Subcategory: "Giáo dục",
    Tag: "trẻ em, giáo dục",
    Publisher: "NXB Hội Nhà Văn",
    Publication_year: 1981,
    Edition: "1",
    Summary: "Câu chuyện cảm động về một cô bé hiếu động và ngôi trường đặc biệt.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.4,
    Cover: "https://example.com/tottochan.jpg",
    CountBorrow: 88,
    Price: "54000",
    Location: { area: "G", shelf: "2", slot: "4" }
  },
  {
    BookID: 28,
    BookCode: "TV008",
    Title: "Người Truy Tìm Dấu Vết",
    Author: "Max Allan Collins",
    Category: "660e4c85a9df5c25b8839db6",
    Subcategory: "Trinh thám",
    Tag: "tội phạm, điều tra",
    Publisher: "NXB Văn Học",
    Publication_year: 2003,
    Edition: "1",
    Summary: "Những cuộc điều tra ly kỳ và bất ngờ.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.2,
    Cover: "https://example.com/dau-vet.jpg",
    CountBorrow: 76,
    Price: "63000",
    Location: { area: "H", shelf: "7", slot: "8" }
  },
  {
    BookID: 29,
    BookCode: "TV009",
    Title: "Sapiens: Lược Sử Loài Người",
    Author: "Yuval Noah Harari",
    Category: "660e4c85a9df5c25b8839db7",
    Subcategory: "Lịch sử",
    Tag: "lịch sử, khoa học",
    Publisher: "NXB Dân Trí",
    Publication_year: 2011,
    Edition: "2",
    Summary: "Hành trình phát triển của loài người từ thời sơ khai đến hiện đại.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.8,
    Cover: "https://example.com/sapiens.jpg",
    CountBorrow: 123,
    Price: "125000",
    Location: { area: "I", shelf: "9", slot: "1" }
  },
  {
    BookID: 30,
    BookCode: "TV010",
    Title: "Hiểu Về Trái Tim",
    Author: "Minh Niệm",
    Category: "660e4c85a9df5c25b8839db2",
    Subcategory: "Thiền - Tâm lý",
    Tag: "thiền, tâm hồn",
    Publisher: "NXB Trẻ",
    Publication_year: 2010,
    Edition: "1",
    Summary: "Cuốn sách chữa lành tâm hồn thông qua sự hiểu biết và thiền định.",
    Language: "Tiếng Việt",
    Availability: "available",
    Rating: 4.9,
    Cover: "https://example.com/hieu-ve-trai-tim.jpg",
    CountBorrow: 198,
    Price: "78000",
    Location: { area: "J", shelf: "3", slot: "9" }
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