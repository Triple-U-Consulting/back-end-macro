const pool = require("../database/database");
const queries = require("./query");
const jwt_decode = require('jwt-decode');

const getHomeData = async (req, res) => {
    const token = req.headers.accesstoken;
    const decoded = jwt_decode(token);
    const inhalerId = decoded.inhaler_id

    if (inhalerId == null) {
        res.status(400).json({
            message: "No inhaler paired"
        })
    } else {
        const todayPuff = await pool.query(queries.getTodaysPuff)
        const weekAvgPuff = await pool.query(queries.getWeekAvgPuff)
        const lastChanged = await pool.query(queries.getInhalerLastChanged, [inhalerId])
        console.log(lastChanged.rows[0]["change_date"])

        const allPuffSinceDate = await pool.query(queries.getAllPuffSinceDate, [lastChanged.rows[0]["change_date"]])
        const remaining = 200 - allPuffSinceDate.rows[0]["total"]

        console.log(remaining)
        console.log(todayPuff.rows[0]["today"])
        console.log(weekAvgPuff.rows[0]["average"])

        res.status(200).json({
            today: todayPuff.rows[0]["today"],
            week_avg: weekAvgPuff.rows[0]["average"],
            remaining: remaining
        })
    }
}

module.exports = {
    getHomeData
};