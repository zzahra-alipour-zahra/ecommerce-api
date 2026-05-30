const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Discount code is required"],
      unique: true,
      uppercase: true
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"]
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"]
    },
    discount: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: 0,
      max: 100
    }
  },
  { timestamps: true }
);

couponSchema.pre('save', function(next) {
 
  if (this.endDate < this.startDate) {
    throw new Error("The end date cannot be before the start date");
  }
  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
