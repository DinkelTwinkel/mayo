const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lurkerSchema = new Schema({

	userId: { type: String, required: true, unique: true },
	lurkTime: { type: Number, default: 0 },

}, { timestamps: true });

const Lurker = mongoose.model('lurker', lurkerSchema);
module.exports = Lurker;