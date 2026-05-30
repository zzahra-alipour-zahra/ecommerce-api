const Product = require('./../../model/Product');
const AppError = require('./../../utils/appError');

exports.validateOrderItems = async (items) => {
  if (!items || items.length === 0) {
    throw new AppError("you dont have order", 400);
  }

  let totalPrice = 0;
  const validatedItems = [];


  for (const item of items) {
    const product = await Product.findById(item._id);

    if (!product) {
      throw new AppError(`No product with this ID ${item._id} was found`, 404);
    }

    if (product.totalQty < item.qty) {
      throw new AppError(`The current stock of this product ${product.name} is insufficient`, 400);
    }

    // calculating price according to database
    const itemTotalPrice = product.price * item.qty;
    totalPrice += itemTotalPrice;

    validatedItems.push({
      _id: product._id,
      name: product.name, 
      qty: item.qty,
      price: product.price 
    });
  }

  return {
    validatedItems,
    totalPrice
  };
};
