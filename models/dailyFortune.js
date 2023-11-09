const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fortuneSchema = new Schema({

	userId: { type: String, required: true, unique: true },
	Fortune: { type: String, required: true, unique: false },
	lastFortuneDay: { type: Number, default: 0 },

}, { timestamps: true });

const Fortune = mongoose.model('fortune', fortuneSchema);
module.exports = Fortune;