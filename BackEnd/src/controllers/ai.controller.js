const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res, next) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Code input is required" });
    }

    try {
        // Now calls a clear function on the imported service object
        const response = await aiService.generateReview(code); 
        
        if (!response || response.trim().length === 0) {
             return res.status(500).json({ error: "AI service returned an empty review." });
        }

        res.json({ review: response });
    } catch (error) {
        console.error("AI Service Error:", error);
        // Pass error to global handler
        error.status = error.status || 500;
        next(error); 
    }
};