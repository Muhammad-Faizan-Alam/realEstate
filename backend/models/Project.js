const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  // Remove custom id and use built-in _id
  title: { type: String, required: true },
  location: { type: String },
  area: { type: String },
  priceFrom: { type: String },
  handover: { type: String },
  image: { type: String },
  city: { type: String },
  whatsappLink: { type: String },
  developer: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer' },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// If you need a custom ID, you can create a virtual or method
projectSchema.virtual('customId').get(function() {
  return this._id.toString();
});

module.exports = mongoose.model('Project', projectSchema);