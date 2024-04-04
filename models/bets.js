const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const betSchema = new Schema({

	postID: { type: String, required: true, unique: false },
	channelID: { type: String, required: true, unique: false },
	userID: { type: String, required: true, unique: false },
	betNumber: { type: Number, required: true },
	betAmount: { type: Number, required: true },

}, { timestamps: true });

const Bets = mongoose.model('bet', betSchema);
module.exports = Bets;