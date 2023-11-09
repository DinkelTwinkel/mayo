const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colourSchema = new Schema({

	userId: { type: String, required: true, unique: true },
	roleID: { type: String, required: true },

}, { timestamps: true });

const Colour = mongoose.model('colour', colourSchema);
module.exports = Colour;