// Puff
const addPuffData = 'INSERT INTO puffs (kambuh_id, date_time) VALUES ($1, $2::timestamp)';
const getAllPuffData = 'SELECT * FROM puffs';
const getLastPuffResult = 'SELECT * FROM puffs ORDER BY date_time DESC';

// Kambuh
const addKambuhData = 'INSERT INTO kambuhs (kambuh_id, start_time)  VALUES ($1 ,$2::timestamp)';
const getAllKambuhData = 'SELECT * FROM kambuhs';
const getKambuhById = 'SELECT * FROM kambuhs WHERE kambuhid = $1';
const findKambuhIdByPk = 'SELECT * FROM kambuhs WHERE kambuh_id = $1';
const updateKambuh = 'UPDATE kambuhs SET end_time = $1, total_puff = $2, kambuh_interval = $3 WHERE kambuh_id = $4';

module.exports = {
    getAllKambuhData,
    getKambuhById,
    addKambuhData,
    getAllPuffData,
    addPuffData,
    getLastPuffResult,
    findKambuhIdByPk,
    updateKambuh,
}