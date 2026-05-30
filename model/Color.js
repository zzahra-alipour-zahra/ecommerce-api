const mongoose = require("mongoose");
const slugify = require("slugify");

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "color name is required"],
      unique: true,
      trim: true,
    },
    slug: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "The color must be connected to the admin"],
    },
  },
  { timestamps: true }
);

colorSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Color", colorSchema);
