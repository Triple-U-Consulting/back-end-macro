const pool = require("../database/database");
const queries = require("./query");
const jwt_decode = require('jwt-decode');

const getHomeData = async (req, res) => {
    try {
        const token = req.headers.accesstoken;
    const decoded = jwt_decode(token);
    const userId = decoded.user_id

    const temp = await pool.query(queries.getUserInhaler, [userId])
    const inhalerId = temp.rows[0].inhaler_id

    if (inhalerId == null) {
        res.status(400).json({
            message: "No inhaler paired"
        })
    } else {
        const todayPuff = await pool.query(queries.getTodaysPuff)
        const weekAvgPuff = await pool.query(queries.getWeekAvgPuff)
        const lastChanged = await pool.query(queries.getInhalerLastChanged, [inhalerId])

        const inhalerRemaining = await pool.query(queries.getInhalerById, [inhalerId])
        const allPuffSinceDate = await pool.query(queries.getAllPuffSinceDate, [lastChanged.rows[0]["change_date"]])
        const remaining = inhalerRemaining.rows[0]["remaining_puff"] - allPuffSinceDate.rows[0]["total"]

        const week_avg = (weekAvgPuff.rows[0] == null) ? 0 : weekAvgPuff.rows[0]

        res.status(200).json({
            today: todayPuff.rows[0]["today"],
            week_avg: week_avg,
            remaining: remaining
        })
    }
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            message: error.message,
        });
    }
}

module.exports = {
    getHomeData
};