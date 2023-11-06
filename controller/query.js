// Puff
const addPuffData =
  "INSERT INTO puffs (kambuh_id, date_time, inhaler_id) VALUES ($1, $2::timestamp, $3)";
const getAllPuffData = "SELECT * FROM puffs";
const getLastPuffResult = "SELECT * FROM puffs ORDER BY date_time DESC";
const getTodaysPuff = "SELECT CAST(COUNT(*) AS INT) AS today FROM puffs WHERE DATE(date_time) = DATE(NOW())"
const getAllPuffSinceDate = "SELECT COUNT(*) AS total FROM puffs WHERE date_time >= $1"

// TODO: - query logic still questionable
const getWeekAvgPuff = "SELECT CAST(COUNT(*) AS FLOAT) / EXTRACT(DAY FROM (puffs.date_time - sub.week_start)) AS average FROM puffs JOIN (SELECT DATE_TRUNC('week', date_time) AS week_start FROM puffs) AS sub ON sub.week_start = DATE_TRUNC('week', puffs.date_time) GROUP BY sub.week_start, puffs.date_time ORDER BY sub.week_start LIMIT 1"

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
const getKambuhDataByDate = 
`SELECT *
FROM kambuhs
WHERE date_trunc('day', start_time::date) = date_trunc('day', $1::date)`;

// User
const addUserData =
  'INSERT INTO users (email, "password", dob) VALUES ($1, $2, $3::date)';
const getAllUserData = "SELECT * FROM users";
const checkEmailExists = "SELECT email FROM users WHERE email = $1";
const getUserDataByEmail = "SELECT * FROM users WHERE email = $1";
const updateInhalerToUser = 'UPDATE users SET inhaler_id = $2 WHERE user_id = $1'
const getUserById = 'SELECT * FROM users WHERE user_id >= $1'

// Inhalers
const getAllInhalersData = "SELECT * FROM inhalers";
const getInhalerById = "SELECT * FROM inhalers WHERE inhaler_id = $1"
const addInhalerData =
  "INSERT INTO inhalers (inhaler_id) VALUES ($1);";
const updateInhalerData =
  "UPDATE inhalers SET inhaler_name = $2 WHERE inhaler_id = $1";
const updateBottleInhaler = 
  "UPDATE inhalers SET change_date = $1, remaining_puff = $2 WHERE inhaler_id = $3";
const getInhalerLastChanged = "SELECT change_date FROM inhalers WHERE inhaler_id = $1"

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
  updateBottleInhaler,
  getInhalerById,
  updateKambuhCondition,
  getKambuhDataByDate,
};
