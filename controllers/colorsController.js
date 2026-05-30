const Color = require("./../model/Color");
const factory = require("./handleFactory");

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createColor = factory.createOne(Color);
exports.getAllColors = factory.getAll(Color);
exports.getColor = factory.getOne(Color);
exports.updateColor = factory.updateOne(Color);
exports.deleteColor = factory.deleteOne(Color);
