const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  orderedBy: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 1
  }
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;