const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pointSchema = new Schema({

	userId: { type: String, required: true, unique: true },
	points: { type: Number, default: 0 },

}, { timestamps: true });

const Point = mongoose.model('point', pointSchema);
module.exports = Point;