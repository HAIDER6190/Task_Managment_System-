const errorHandler = (err, req, res, next) => {
    console.error("ERROR:", err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map(e => e.message)
            .join(", ");
    }

    // Duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value";
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorHandler;
