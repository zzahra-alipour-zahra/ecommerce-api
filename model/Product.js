const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product must have a name"],
      unique: true,
      trim: true,
      maxlength: [100, "product's name must be less than 100 charrechter"]
    },
    slug: String,
    description: {
      type: String,
      required: [true, "product must have description"],
      trim: true
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, "product must have a brand"]
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, "product must have category"]
    },
    sizes: {
      type: [String],
      enum: {
        values: ["S", "M", "L", "XL", "XXL"],
        message: "size must be a value of S , M , L , XL , XXL"
      },
      required: true
    },
    colors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color'
      }
    ],
    user: { //admin: who create product
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    images: [String],
    imageCover: {
      type: String,
      // required: [true, "product must have imagecove"]
    },
    price: {
      type: Number,
      required: [true, "product must have price"]
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: "discount should be less than price "
      }
    },
    totalQty: {
      type: Number,
      required: [true, "totalQty should be define"]
    },
    totalSold: {
      type: Number,
      default: 0
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Average rating cannot be negative"],
      max: [5, "Average rating cannot exceed 5"],
      set: val => Math.round(val * 10) / 10 
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//  Indexes 
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });

//  Virtuals 
productSchema.virtual("qtyLeft").get(function() {
  return this.totalQty - this.totalSold;
});

// Virtual Populate for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

//  Document Middlewares 
productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//  Query Middlewares 
productSchema.pre(/^find/, function(next) {
  // dont show the products was deleted(soft deleted)
  this.find({ active: { $ne: false } });
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
