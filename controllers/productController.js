const Product = require('./../model/Product');
const Category = require('./../model/Category');
const Brand = require('./../model/Brand');
const factory = require('./handleFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, { path: 'reviews' });
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);


exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, category: categoryId, brand: brandId } = req.body;

  const categoryFound = await Category.findById(categoryId);
  if (!categoryFound) return next(new AppError("category was not find", 404));

  const brandFound = await Brand.findById(brandId);
  if (!brandFound) return next(new AppError("beand was not find", 404));

  // adding admin's id on product user field
  req.body.user = req.user.id; 

  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: { data: product }
  });
});

exports.setCategoryId = (req, res, next) => {
  if (!req.query.category && req.params.categoryId) {
    req.query.category = req.params.categoryId;
  }
  next();
};

exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.0 } }
    },
    {
      $group: {
        _id: '$category', 
        numProducts: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        totalInventory: { $sum: '$totalQty' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});
