module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error";
    return res.json({
      statusCode: err.statusCode,
      message: err.message,
    });
  };
  