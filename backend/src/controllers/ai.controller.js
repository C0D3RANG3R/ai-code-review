const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res, next) => {
    const { code } = req.body;

    if (!code) {
        const error = new Error("Code input is required");
        error.status = 400;
        return next(error);
    }

    try {
        const response = await aiService.generateReview(code);
        
        if (!response || response.trim().length === 0) {
             const error = new Error("AI service returned an empty review.");
             error.status = 502;
             return next(error);
        }

        res.json({ review: response });
    } catch (error) {
        next(error); 
    }
};