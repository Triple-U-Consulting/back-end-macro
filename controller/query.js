// Puff
const addPuffData =
  "INSERT INTO puffs (kambuh_id, date_time, inhaler_id) VALUES ($1, $2::timestamp, $3)";
const getAllPuffData = "SELECT * FROM puffs";
const getLastPuffResult = "SELECT * FROM puffs ORDER BY date_time DESC";
const getTodaysPuff =
  "SELECT CAST(COUNT(*) AS INT) AS today FROM puffs WHERE DATE(date_time) = DATE(NOW())";
const getAllPuffSinceDate =
  "SELECT COUNT(*) AS total FROM puffs WHERE date_time >= $1";

// TODO: - query logic still questionable
const getWeekAvgPuff =
  "SELECT CAST(COUNT(*) AS FLOAT) / EXTRACT(DAY FROM (puffs.date_time - sub.week_start)) AS average FROM puffs JOIN (SELECT DATE_TRUNC('week', date_time) AS week_start FROM puffs) AS sub ON sub.week_start = DATE_TRUNC('week', puffs.date_time) GROUP BY sub.week_start, puffs.date_time ORDER BY sub.week_start LIMIT 1";

// Kambuh
const addKambuhData =
  "INSERT INTO kambuhs (kambuh_id, start_time)  VALUES ($1 ,$2::timestamp)";
const getAllKambuhData = "SELECT * FROM kambuhs";
const getKambuhById = "SELECT * FROM kambuhs WHERE kambuhid = $1";
const findKambuhIdByPk = "SELECT * FROM kambuhs WHERE kambuh_id = $1";
const updateKambuh =
  "UPDATE kambuhs SET end_time = $1, total_puff = $2, kambuh_interval = $3 WHERE kambuh_id = $4";
const updateKambuhCondition =
  "UPDATE kambuhs SET scale = $1, trigger = $2 WHERE kambuh_id = $3";
const getKambuhDataByDate = `SELECT *
FROM kambuhs
WHERE date_trunc('day', start_time::date) = date_trunc('day', $1::date)`;
const getKambuhDataByMonth = 
`SELECT * FROM kambuhs
WHERE date_trunc('month', start_time::date) = date_trunc('month', $1::date)`;

// User
const addUserData =
  'INSERT INTO users (email, "password", dob) VALUES ($1, $2, $3::date)';
const getAllUserData = "SELECT * FROM users";
const checkEmailExists = "SELECT email FROM users WHERE email = $1";
const getUserDataByEmail = "SELECT * FROM users WHERE email = $1";
const updateInhalerToUser =
  "UPDATE users SET inhaler_id = $2 WHERE user_id = $1";
const getUserById = "SELECT * FROM users WHERE user_id >= $1";
const getUserInhaler = "SELECT inhaler_id FROM users WHERE user_id = $1";

// Inhalers
const getAllInhalersData = "SELECT * FROM inhalers";
const getInhalerById = "SELECT * FROM inhalers WHERE inhaler_id = $1";
const addInhalerData = "INSERT INTO inhalers (inhaler_id) VALUES ($1);";
const updateInhalerData =
  "UPDATE inhalers SET inhaler_name = $2 WHERE inhaler_id = $1";
const updateBottleInhaler =
  "UPDATE inhalers SET change_date = $1, remaining_puff = $2 WHERE inhaler_id = $3";
const getInhalerLastChanged =
  "SELECT change_date FROM inhalers WHERE inhaler_id = $1";

// Analytics
const getWeeklyAnalytics = `SELECT
date_trunc($3, date_time) as start_date,
CASE
        WHEN $3 = 'day' THEN date_trunc($3, date_time) + interval '1 day' - interval '1 second'
        WHEN $3 = 'week' THEN date_trunc($3, date_time) + interval '1 week' - interval '1 second'
        WHEN $3 = 'month' THEN date_trunc($3, date_time) + interval '1 month' - interval '1 day'
        WHEN $3 = 'year' THEN date_trunc($3, date_time) + interval '1 year' - interval '1 day'
        ELSE date_trunc($3, date_time)
    END as end_date,
SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 7 AND 20 THEN 1 ELSE 0 END) as daytimeusage,
SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 21 AND 23 OR EXTRACT(HOUR FROM date_time) BETWEEN 0 AND 6 THEN 1 ELSE 0 END) as nightusage
from puffs
where date(date_time) between $1 and $2
group by start_date
order by start_date`;

module.exports = {
  getAllKambuhData,
  getKambuhById,
  addKambuhData,
  getAllPuffData,
  addPuffData,
  getLastPuffResult,
  getTodaysPuff,
  getAllPuffSinceDate,
  getWeekAvgPuff,
  getInhalerLastChanged,
  findKambuhIdByPk,
  updateKambuh,
  updateKambuhCondition,
  addUserData,
  getAllUserData,
  checkEmailExists,
  getUserDataByEmail,
  getAllInhalersData,
  addInhalerData,
  updateInhalerData,
  updateInhalerToUser,
  getUserById,
  getUserInhaler,
  updateBottleInhaler,
  getInhalerById,
  updateKambuhCondition,
  getKambuhDataByDate,
  getWeeklyAnalytics,
  getKambuhDataByMonth,
};
