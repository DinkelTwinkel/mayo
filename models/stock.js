const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({

	stockName: { type: String, required: true, unique: true },
	currentValue: { type: Number, required: true },
	passiveFluctuation: { type: Number, required: true },
	onePercentChanceFluctuation: { type: Number, required: true },
	rising: { type: Boolean, required: true, default: true },

}, { timestamps: true });

const Stock = mongoose.model('stock', stockSchema);
module.exports = Stock;