const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({

	itemName: { type: String, required: true, unique: false },
	ownerId: { type: String, required: true, unique: false  },
	quantity: { type: Number, required: true, unique: false  },

}, { timestamps: true });

const Inventory = mongoose.model('inventory', inventorySchema);
module.exports = Inventory;