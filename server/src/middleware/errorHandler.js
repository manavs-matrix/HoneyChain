// Standardized error handler middleware per Rules.md

function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    data: null,
    error: errorMessage
  });
}

module.exports = errorHandler;
