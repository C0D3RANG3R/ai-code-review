const aiService = require("../services/ai.service");

const getReview = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code || typeof code !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Valid code string is required'
            });
        }

        const response = await aiService(code);

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error processing code review',
            error: error.message
        });
    }
};

module.exports = {
    getReview
};