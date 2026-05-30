const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) return next(new AppError("no find any thing with this id", 404));
  res.status(204).json({ status: 'success', data: null });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) return next(new AppError("no find any thing with this id", 404));
  res.status(200).json({ status: 'success', data: { data: doc } });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(201).json({ status: 'success', data: { data: doc } });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;
  if (!doc) return next(new AppError("no find any thing with this id", 404));
  res.status(200).json({ status: 'success', data: { data: doc } });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
  let filter = {};
  // getting documents from specific category
  if (req.params.categoryId) {
    filter.category = req.params.categoryId;
  }

  // getting reviews from specific product
  if (req.params.productId) {
    filter.product = req.params.productId;
  }

  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    
  const docs = await features.query;

  res.status(200).json({
    status: 'success',
    results: docs.length,
    data: { data: docs }
  });
});
