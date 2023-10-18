// Puff
const addPuffData =
  "INSERT INTO puffs (kambuh_id, date_time) VALUES ($1, $2::timestamp)";
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

// Inhalers
const getAllInhalersData = "SELECT * FROM inhalers";
const addInhalerData =
  "INSERT INTO inhalers (inhaler_id, inhaler_name) VALUES ($1, $2);";

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
};
