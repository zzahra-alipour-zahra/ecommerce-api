module.exports = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
      //when i want to use a syncrones function
      // with catchasync ishould use the promise.resolve
      //Promise.resolve(fn(req,res,next)).catch(next)
    };
  };
  