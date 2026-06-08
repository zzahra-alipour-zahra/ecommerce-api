
const Product = require('./../../model/Product');

exports.bulkUpdateStock = async (orderItems, session) => {
  const bulkOptions = orderItems.map(item => ({
    updateOne: {
      filter: { _id: item._id , totalQty: { $gte: item.qty } }, 
      update: { $inc: { totalQty: -item.qty, totalSold: +item.qty } } 
    }
  }));

  const result = await Product.bulkWrite(bulkOptions, { session });

  if (result.modifiedCount !== orderItems.length) {

    throw new Error("The inventory of one or more items has changed and is not sufficient to place an order");
  }


  // await Product.bulkWrite(bulkOptions, { session });
};

