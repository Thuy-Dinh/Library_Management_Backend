const mongoose = require('mongoose');
const Account = require("../models/Account");
const BookModel = require("../models/Book");
const Loan = require("../models/Loan")
const CategoryModel = require("../models/Category");
const Area = require("../models/Area")

exports.bookDetailSV = async (bookID) => {
    const bookIdsArray = bookID.includes(",") ? bookID.split(",") : [bookID]; // Chuyển thành mảng
    const books = await BookModel.find({ _id: { $in: bookIdsArray } }); // Tìm nhiều sách
    console.log(books);
    return books;
};

exports.proposeBookSV = async (bookID) => {
    try {
        // Tìm sách theo ID
        const book = await BookModel.findById({ _id: bookID }).populate('Category');
        if (!book) {
            throw new Error('Không tìm thấy sách với ID đã cho');
        }

        // Tìm các sách cùng Category nhưng loại trừ sách hiện tại
        const sameCategoryBooks = await BookModel.find({
            Category: book.Category._id, // Sử dụng CategoryID để so sánh
            _id: { $ne: bookID } // Loại trừ sách hiện tại
        }).populate('Category'); // Thêm thông tin chi tiết về Category nếu cần

        return sameCategoryBooks;
    } catch (error) {
        console.error(error);
        throw new Error('Lỗi khi lấy danh sách sách đề xuất');
    }
};

exports.getAllBookSV = async () => {
    try {
        // Sử dụng populate để lấy thông tin Category thông qua CategoryID
        return await BookModel.find({}).populate('Category');
    } catch (error) {
        console.error("Error in getAllBookSV:", error);
        throw error;
    }
};

exports.createBookSV = async (bookData) => {
    try {
      // Tạo và lưu sách (bookData đã chứa cả Price và Location)
      const newBook = new BookModel(bookData);
      const savedBook = await newBook.save();
  
      // Cập nhật số lượng trong Category
      await CategoryModel.findByIdAndUpdate(
        bookData.Category,
        { $inc: { Quantity: 1 } },
        { new: true }
      );
  
      // Trả về sách đã populate
      return await BookModel.findById(savedBook._id).populate('Category');
    } catch (error) {
      console.error("Error saving book:", error);
      throw new Error("Error saving book");
    }
};  

exports.editBookSV = async ({
    id,
    title,
    author,
    subcategory,
    tag,
    publisher,
    publication_year,
    edition,
    summary,
    language,
    state,
    cover,
    location // object: { area, shelf, slot }
}) => {
    try {
        const updatedBook = await BookModel.findByIdAndUpdate(
            id,
            {
                Title: title,
                Author: author,
                Subcategory: subcategory,
                Tag: tag,
                Publisher: publisher,
                Publication_year: publication_year,
                Edition: edition,
                Summary: summary,
                Language: language,
                Availability: state,
                Cover: cover,
                Location: location // cập nhật đầy đủ location
            },
            { new: true }
        );

        return updatedBook;
    } catch (error) {
        console.error("Error updating book:", error);
        throw new Error("Error updating book");
    }
};

exports.deleteBookSV = async (bookID) => {
    try {
        // Tìm và xóa sách bằng ID
        const deletedBook = await BookModel.findOneAndDelete({ _id: bookID });

        if (deletedBook) {
            // Giảm số lượng sách trong Category
            await CategoryModel.findByIdAndUpdate(
                deletedBook.Category, // ID của category liên quan
                { $inc: { Quantity: -1 } } // Giảm Quantity đi 1
            );
        }

        return deletedBook; // Trả về sách đã xóa (hoặc null nếu không tìm thấy)
    } catch (error) {
        console.error("Error deleting book:", error);
        throw new Error("Error deleting book");
    }
};

exports.getAllTopicSV = async () => {
    try {
        return await CategoryModel.find({});
    } catch (error) {
        console.error("Error in getAllTopicSV:", error);
        throw error;
    }
};

exports.getCategoryById = async (id) => {
    // Nếu id không hợp lệ (không phải ObjectId), Mongoose sẽ ném CastError
    return await CategoryModel.findById(id).lean();
};

exports.createTopicSV = async (topicData) => {
    try {
        // Tạo một Category mới
        const newCategory = new CategoryModel({
            Name: topicData.topic,
            Quantity: 0, // Số lượng mặc định là 0
        });

        // Lưu Category mới vào cơ sở dữ liệu
        const savedCategory = await newCategory.save();

        return savedCategory;
    } catch (error) {
        console.error("Lỗi khi lưu chủ đề:", error);
        throw new Error("Lỗi khi lưu chủ đề");
    }
};


exports.searchByCategorySV = async (topics) => {
    try {
        // Xử lý danh sách topics được truyền vào
        const categoryObjects = await CategoryModel.find({ Name: { $in: topics.map(t => new RegExp(t, 'i')) } });
        if (!categoryObjects || categoryObjects.length === 0) {
            console.log("No categories found with the given topics.");
            return [];
        }

        // Lấy danh sách _id của các category tìm được
        const categoryIds = categoryObjects.map(category => category._id);

        // Tìm sách thuộc một trong các category tìm được
        const books = await BookModel.find({ Category: { $in: categoryIds } });
        return books;
    } catch (error) {
        console.error("Error in searchByCategorySV:", error);
        throw error;
    }
};

exports.searchSuggestionSV = async (keyword) => {
    try {
        const suggestions = await BookModel.find()
            .populate({
                path: 'Category',
                select: 'Name', // Chỉ lấy trường Name trong Category
            })
            .limit(10)
            .exec();

        // Lọc kết quả sau khi populate
        const filteredSuggestions = suggestions.filter((book) => {
            const codeMatch = book.BookCode?.toLowerCase().includes(keyword.toLowerCase());
            const titleMatch = book.Title?.toLowerCase().includes(keyword.toLowerCase());
            const authorMatch = book.Author?.toLowerCase().includes(keyword.toLowerCase());
            const categoryMatch = book.Category?.Name?.toLowerCase().includes(keyword.toLowerCase());

            return codeMatch || titleMatch || authorMatch || categoryMatch;
        });

        return filteredSuggestions.map((book) => ({
            Code: book.BookCode,
            Title: book.Title,
            Author: book.Author,
            Category: book.Category?.Name || null,
        }));
    } catch (error) {
        console.error("Error in searchSuggestionSV:", error);
        throw error;
    }
};

exports.searchResultSV = async (keyword) => {
    try {
        const suggestions = await BookModel.find()
            .populate({
                path: 'Category',
                select: 'Name', // Chỉ lấy trường Name trong Category
            })
            .limit(10)
            .exec();

        // Lọc kết quả sau khi populate
        const filteredSuggestions = suggestions.filter((book) => {
            const titleMatch = book.Title?.toLowerCase().includes(keyword.toLowerCase());
            const authorMatch = book.Author?.toLowerCase().includes(keyword.toLowerCase());
            const categoryMatch = book.Category?.Name?.toLowerCase().includes(keyword.toLowerCase());
            const subcategoryMatch = book.Subcategory?.toLowerCase().includes(keyword.toLowerCase());
            const tagMatch = book.Tag?.toLowerCase().includes(keyword.toLowerCase());

            return titleMatch || authorMatch || categoryMatch || subcategoryMatch || tagMatch;
        });

        return filteredSuggestions.map((book) => ({
            ...book.toObject(), // Trả về tất cả thông tin của tài liệu
        }));
    } catch (error) {
        console.error("Error in searchSuggestionSV:", error);
        throw error;
    }
};

exports.searchBookByOtherFieldSV = async (params) => {
    const {
      title,
      publisher,
      author,
      language,
      year,
      keyword,
      sortBy = 'Title',
      sortOrder = 'asc',
      limit = 500
    } = params;
  
    const query = {};
  
    if (title) query.Title = { $regex: title, $options: 'i' };
    if (publisher) query.Publisher = { $regex: publisher, $options: 'i' };
    if (author) query.Author = { $regex: author, $options: 'i' };
    if (language) query.Language = { $regex: language, $options: 'i' };
    if (year) query.Publication_year = parseInt(year);
    if (keyword) {
      query.$or = [
        { Title: { $regex: keyword, $options: 'i' } },
        { Author: { $regex: keyword, $options: 'i' } },
        { Publisher: { $regex: keyword, $options: 'i' } },
        { Subcategory: { $regex: keyword, $options: 'i' } },
        { Tag: { $regex: keyword, $options: 'i' } },
        { Summary: { $regex: keyword, $options: 'i' } }
      ];
    }
  
    const sortQuery = {};
    sortQuery[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
    const books = await BookModel.find(query)
      .sort(sortQuery)
      .limit(Number(limit));
  
    return books;
};

exports.getAllAreas = async () => {
    try {
      const areas = await Area.find().populate("Topics").lean();
      return areas;
    } catch (err) {
      throw new Error("Không thể lấy danh sách khu vực");
    }
};

exports.getAgeGroup = (birthDate) => {
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    if (age <= 12) return 'children';
    if (age <= 17) return 'teen';
    if (age <= 50) return 'adult';
    return 'senior';
  };
  
const getBooksByAgeGroup = async (group) => {
    switch (group) {
      case 'children':
        return await BookModel.find({
          $or: [
            { Tag: /thiếu nhi/i },
            { Subcategory: /thiếu nhi|truyện tranh/i }
          ]
        }).limit(10);
      case 'teen':
        return await BookModel.find({
          $or: [
            { Tag: /tuổi teen|kỹ năng sống/i },
            { Subcategory: /giáo dục tuổi teen/i }
          ]
        }).limit(10);
      case 'adult':
        return await BookModel.find({
          $or: [
            { Tag: /tiểu thuyết|phát triển bản thân/i },
            { Subcategory: /văn học|học thuật|kỹ năng/i }
          ]
        }).limit(10);
      case 'senior':
        return await BookModel.find({
          $or: [
            { Tag: /sức khỏe|hồi ký|lịch sử/i },
            { Subcategory: /văn hóa|truyền thống/i }
          ]
        }).limit(10);
      default:
        return [];
    }
};
  
exports.getRecommendedBooks = async (accountId) => {
    const userLoans = await Loan.find({ AccountID: accountId }).populate('BookID');
  
    if (userLoans.length === 0) {
      const user = await Account.findById(accountId);
      if (!user || !user.Age) {
        return {
          type: 'popular',
          books: await BookModel.find().sort({ CountBorrow: -1 }).limit(10)
        };
      }
  
      const group = getAgeGroup(user.Age);
      const books = await getBooksByAgeGroup(group);
      return { type: 'age-based', ageGroup: group, books };
    }
  
    // Tính toán theo lịch sử mượn
    const preferences = {
      categories: new Set(),
      tags: new Set(),
      authors: new Set(),
      bookIds: new Set()
    };
  
    userLoans.forEach(loan => {
      loan.BookID.forEach(book => {
        if (book.Category) preferences.categories.add(book.Category.toString());
        if (book.Tag) preferences.tags.add(book.Tag);
        if (book.Author) preferences.authors.add(book.Author);
        preferences.bookIds.add(book._id.toString());
      });
    });
  
    const recommendedBooks = await BookModel.find({
      $and: [
        {
          $or: [
            { Category: { $in: Array.from(preferences.categories) } },
            { Tag: { $in: Array.from(preferences.tags) } },
            { Author: { $in: Array.from(preferences.authors) } }
          ]
        },
        { _id: { $nin: Array.from(preferences.bookIds) } }
      ]
    })
    .limit(10)
    .populate('Category');
  
    return { type: 'personalized', books: recommendedBooks };
};

exports.addBookReview = async (bookId, userId, rating, comment) => {
  const book = await BookModel.findById(bookId);
  if (!book) throw new Error('Không tìm thấy sách');

  const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === userId.toString()
  );
  if (alreadyReviewed) throw new Error('Bạn đã đánh giá sách này rồi');

  book.reviews.push({
      user: userId,
      rating,
      comment
  });

  // Cập nhật điểm trung bình
  book.Rating = Number(
    (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length).toFixed(1)
  );  

  await book.save();
  return book;
};