const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	writer: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

BoardSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.createdAt = obj.createdAt.toISOString().split('T')[0];
  return obj;
};

module.exports = mongoose.model('Board', BoardSchema);
