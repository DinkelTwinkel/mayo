const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({

	itemName: { type: String, required: true, unique: true },
	ownerId: { type: String, required: true },
	quantity: { type: Number, required: true },

}, { timestamps: true });

const Inventory = mongoose.model('inventory', inventorySchema);
module.exports = Inventory;