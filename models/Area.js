const mongoose = require('mongoose');

const AreaSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
});

module.exports = mongoose.model('Area', AreaSchema);