const overViewService = require("../services/overviewService");

exports.bookTotal = async (req, res) => {
    try {
        const bookTotal = await overViewService.getTotalBook();
        res.status(200).json({ totalBooks: bookTotal });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving total books" });
    }
}

exports.availableBook = async (req, res) => {
    try {
        const availableBook = await overViewService.getAvailableBook();
        res.status(200).json({ totalAvailableBooks: availableBook });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving total books" });
    }
}

exports.getTopBorrowedBooks = async (req, res) => {
    try {
        const topBooks = await overViewService.getTopBooksByBorrowCount();
        res.status(200).json({ topBorrowedBooks: topBooks });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving top borrowed books" });
    }
};

exports.countBorrowedByTime = async (req, res) => {
    const { day, month, year } = req.body;

    try {
        const result = await overViewService.getCountBorrowedByTime(day, month, year);
        const countBooks = result.length > 0 ? result[0].countBorrowedBooks : 0;
        res.status(200).json({ countBorrowedBooks: countBooks });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving borrowed books by time" });
    }
};

exports.getBorrowedByMonth = async (req, res) => {
    const year = parseInt(req.query.year, 10);
    if (!year) return res.status(400).json({ error: 'Missing or invalid year' });
  
    try {
      const data = await overViewService.getBorrowedBooksByMonth(year);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

exports.getDamagedBooksCount = async (req, res) => {
    try {
      const count = await overViewService.countDamagedBooks();
      res.json({ damagedBooks: count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  