const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true },
    city: [{ type: String, required: true }],
    // role: { type: String, required: true },
    connections: [{
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'PropertyDetail' },
    req: { type: Boolean, default: false }
  }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);
