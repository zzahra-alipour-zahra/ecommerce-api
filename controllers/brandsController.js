const Brand = require("./../model/Brand");
const factory = require("./handleFactory");


exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createBrand = factory.createOne(Brand);
exports.getAllBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand, );
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);

