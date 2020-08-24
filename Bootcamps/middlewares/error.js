const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
