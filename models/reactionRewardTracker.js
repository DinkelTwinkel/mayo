const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rewardLimitSchema = new Schema({

	messageId: { type: String, required: true, unique: false },
	reactorId: { type: String, required: true, unique: false },

}, { timestamps: true });

const ReactionLimit = mongoose.model('rewardLimit', rewardLimitSchema);
module.exports = ReactionLimit;