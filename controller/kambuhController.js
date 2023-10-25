const pool = require("../database/database");
const queries = require("./query");

const getKambuhData = async (req, res, next) => {
  pool.query(queries.getAllKambuhData, (error, results) => {
    if (error) throw error;
    res.status(200).json({ message: results.rows });
  });
};

const getKambuhById = async (req, res, next) => {
  const id = req.params.kambuhid;
  pool.query(queries.findKambuhIdByPk, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json({ message: results.rows } );
  });
};

const addKambuhData = async (req, res) => {
  try {
    const lastPuff = await pool.query(queries.getLastPuffResult);
    const lastPuffLast = lastPuff.rows[0];
    const now = new Date();
    const { inhaler_id } = req.body;

    let currentKambuhID = 0;

    if (lastPuff.rows.length > 0) {
      const timeDiff = now - new Date(lastPuffLast.date_time);
      if (timeDiff <= 10000) {
        currentKambuhID = lastPuffLast.kambuh_id;
      } else {
        currentKambuhID = lastPuffLast.kambuh_id + 1;
        await pool.query(queries.addKambuhData, [currentKambuhID, now]);
      }
    } else {
      currentKambuhID = 1;
      await pool.query(queries.addKambuhData, [currentKambuhID, now]);
    }

    const newPuff = await pool.query(queries.addPuffData, [
      currentKambuhID,
      now,
      inhaler_id
    ]);

    // update row
    const currentKambuh = await pool.query(queries.findKambuhIdByPk, [
      currentKambuhID,
    ]);
    const currentKambuhLast = currentKambuh.rows[0];
    currentKambuhLast.end_time = new Date();
    currentKambuhLast.total_puff += 1;
    currentKambuhLast.kambuh_interval =
      currentKambuhLast.end_time - currentKambuhLast.start_time;

    console.log(currentKambuhLast.kambuh_interval);

    // Extract to hours, minute, seconds
    // const timeDifference = new Date(currentKambuhLast.kambuh_interval);
    // const hours = timeDifference.getHours() - 7;
    // const minutes = timeDifference.getMinutes();
    // const seconds = timeDifference.getSeconds();
    // const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    //const convertKambuhIntervalToTime = moment().format()

    await pool.query(queries.updateKambuh, [
      currentKambuhLast.end_time,
      currentKambuhLast.total_puff,
      currentKambuhLast.kambuh_interval,
      currentKambuhID,
    ]);

    res.status(201).json({
      message: "Successfully",
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: error.message
    });
  }
};

const getPuffData = async (req, res, next) => {
  pool.query(queries.getAllPuffData, (error, results) => {
    if (error) throw error;
    res.status(200).json({result: results.rows });
  });
};

module.exports = {
  getKambuhData,
  getKambuhById,
  addKambuhData,
  getPuffData,
};