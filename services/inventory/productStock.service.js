
const Product = require('./../../model/Product');

exports.bulkUpdateStock = async (orderItems, session) => {
  const bulkOptions = orderItems.map(item => ({
    updateOne: {
      filter: { _id: item._id , totalQty: { $gte: item.qty } }, 
      update: { $inc: { totalQty: -item.qty, totalSold: +item.qty } } 
    }
  }));


  await Product.bulkWrite(bulkOptions, { session });
};

