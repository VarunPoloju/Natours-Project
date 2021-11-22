class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // status depends on statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // operational errors --> in case in future if might happen like bug errrs
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
