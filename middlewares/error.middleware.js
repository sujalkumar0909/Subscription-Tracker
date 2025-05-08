const errorMiddleware = (err, req, res, next) => {
    try {
        // 1. Create a proper error object copy
        let error = { 
            ...err,
            message: err.message,
            statusCode: err.statusCode || 500
        };

        console.log('Error:', error);

        // 2. Handle specific error types
        if (err.name === 'CastError') {
            error.message = 'Resource not found';
            error.statusCode = 404;
        }
        else if (err.code === 11000) {
            error.message = 'Duplicate field value entered';
            error.statusCode = 400;
        }                
        else if (err.name === 'ValidationError') {
            // 3. Fixed ValidationError handling
            error.message = Object.values(err.errors)
                .map(val => val.message)
                .join(', ');
            error.statusCode = 400;
        }

        // 4. Proper response formatting
        res.status(error.statusCode).json({
            success: false,
            error: error.message || 'Server Error',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    } catch (error) {
        // 5. Fallback for middleware errors
        res.status(500).json({
            success: false,
            error: 'Internal middleware error'
        });
    }
};

export default errorMiddleware;