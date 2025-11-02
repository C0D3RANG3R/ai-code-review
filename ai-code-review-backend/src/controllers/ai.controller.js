const aiService = require("../services/ai.service");

const getReview = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code || typeof code !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Validation Error: A valid code string is required in the request body.'
            });
        }
        
        const trimmedCode = code.trim();

        if (trimmedCode.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation Error: Code string cannot be empty or only whitespace.'
            });
        }

        const response = await aiService(trimmedCode);

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        const statusCode = error.statusCode || 500; 
        
        console.error(`[API_CONTROLLER_ERROR] Path: ${req.path}, Status: ${statusCode}, Message: ${error.message}`);

        return res.status(statusCode).json({
            success: false,
            message: `Error processing code review. Detail: ${error.message}`, 
        });
    }
};

module.exports = {
    getReview
};