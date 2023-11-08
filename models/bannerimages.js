const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannerSchema = new Schema({

	imageLink: { type: String, required: true, unique: true },
	submissionUser: { type: String, required: true, unique: false },

}, { timestamps: true });

const Banner = mongoose.model('bannerLink', bannerSchema);
module.exports = Banner;