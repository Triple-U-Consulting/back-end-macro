// Puff
const addPuffData =
  "INSERT INTO puffs (kambuh_id, date_time, inhaler_id) VALUES ($1, $2::timestamp, $3)";
const getAllPuffData = "SELECT * FROM puffs";
const getLastPuffResult = "SELECT * FROM puffs ORDER BY date_time DESC";

// Kambuh
const addKambuhData =
  "INSERT INTO kambuhs (kambuh_id, start_time)  VALUES ($1 ,$2::timestamp)";
const getAllKambuhData = "SELECT * FROM kambuhs";
const getKambuhById = "SELECT * FROM kambuhs WHERE kambuhid = $1";
const findKambuhIdByPk = "SELECT * FROM kambuhs WHERE kambuh_id = $1";
const updateKambuh =
  "UPDATE kambuhs SET end_time = $1, total_puff = $2, kambuh_interval = $3 WHERE kambuh_id = $4";

// User
const addUserData =
  'INSERT INTO users (email, "password", dob) VALUES ($1, $2, $3::date)';
const getAllUserData = "SELECT * FROM users";
const checkEmailExists = "SELECT email FROM users WHERE email = $1";
const getUserDataByEmail = "SELECT * FROM users WHERE email = $1";
const updateInhalerToUser = 'UPDATE users SET inhaler_id = $2 WHERE user_id = $1'
const getUserById = 'SELECT * FROM users WHERE user_id = $1'

// Inhalers
const getAllInhalersData = "SELECT * FROM inhalers";
const addInhalerData =
  "INSERT INTO inhalers (inhaler_id) VALUES ($1);";
const updateInhalerData =
  "UPDATE inhalers SET inhaler_name = $2 WHERE inhaler_id = $1";

module.exports = {
  getAllKambuhData,
  getKambuhById,
  addKambuhData,
  getAllPuffData,
  addPuffData,
  getLastPuffResult,
  findKambuhIdByPk,
  updateKambuh,
  addUserData,
  getAllUserData,
  checkEmailExists,
  getUserDataByEmail,
  getAllInhalersData,
  addInhalerData,
  updateInhalerData,
  updateInhalerToUser,
  getUserById,
};
