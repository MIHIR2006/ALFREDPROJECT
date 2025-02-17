const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    if (process.env.NODE_ENV === 'development') {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });
    } else {
      // Error response for production
      if (err.isOperational) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
          code: err.errorCode
        });
      } else {
        // Programming or unknown errors: don't leak error details
        console.error('ERROR 💥', err);
        res.status(500).json({
          status: 'error',
          message: 'Something went wrong!'
        });
      }
    }
  };
  
  module.exports = errorHandler;  // Make sure this line exists