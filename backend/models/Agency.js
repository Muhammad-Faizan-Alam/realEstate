const mongoose = require("mongoose");

const AgencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    verify: { type: Boolean, default: false }
    // rating: { type: Number, default: 0 },
    // reviewCount: { type: Number, default: 0 },
    // propertiesCount: { type: Number, default: 0 },
    // specialization: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agency", AgencySchema);
