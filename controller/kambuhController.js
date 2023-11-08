const pool = require("../database/database");
const queries = require("./query");

const getKambuhData = async (req, res, next) => {
  pool.query(queries.getAllKambuhData, (error, results) => {
    if (error) throw error;
    res.status(200).json({ message: results.rows });
  });
};

const updateCondition = async (req, res, next) => {
  try {
    const { allValuetoUpdate } = req.body;
    allValuetoUpdate.forEach((kambuh) => {
      const kambuh_id = kambuh["kambuh_id"];
      const scale = kambuh["scale"];
      const trigger = kambuh["trigger"];

      pool.query(queries.updateKambuhCondition, [scale, trigger, kambuh_id]);
    });
    res.status(201).json({
      message: "Updatted condition",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getKambuhById = async (req, res, next) => {
  const id = req.params.kambuhid;
  pool.query(queries.findKambuhIdByPk, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json({ message: results.rows });
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
      inhaler_id,
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

    //console.log(currentKambuhLast.kambuh_interval);

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
      message: error.message,
    });
  }
};

const getKambuhDataByDate = async (req, res) => {
  try {
    const date = req.query.date;
    //let currentDate = date.toJSON().slice(0, 10);
    console.log(date);
    const kambuhData = await pool.query(queries.getKambuhDataByDate, [date]);
    console.log(kambuhData.rows);
    if (!kambuhData.rows.length) {
      return res.status(200).json({ results: [] });
    }
    return res.status(200).json({
      results: kambuhData.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getKambuhDataByMonth = async (req, res) => {
  try {
    const date = req.query.date;
    //let currentDate = date.toJSON().slice(0, 10);
    console.log(date);
    const kambuhData = await pool.query(queries.getKambuhDataByMonth, [date]);
    console.log(kambuhData.rows);
    if (!kambuhData.rows.length) {
      return res.status(200).json({ results: [] });
    }
    return res.status(200).json({
      results: kambuhData.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getPuffData = async (req, res, next) => {
  pool.query(queries.getAllPuffData, (error, results) => {
    if (error) throw error;
    res.status(200).json({ result: results.rows });
  });
};

// Analytics
const getAnalytics = async (req, res) => {
  const startDate = req.query.start_date;
  const frequency = req.query.frequency;
  if (!startDate) {
    return res.status(400).send("Harap tentukan tanggal awal!");
  }

  if (!frequency) {
    return res.status(400).send("Tentukan frekuensi!");
  }

  if (frequency === "week") {
    query = queries.getWeeklyAnalytics;
  } else if (frequency === "month") {
    query = queries.getMonthlyAnalytics;
  } else if (frequency === "year") {
    query = queries.getYearlyAnalytics;
  }

  try {
    const analyticsData = await pool.query(query, [startDate]);
    console.log(analyticsData.rows);
    res.json({ results: analyticsData.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getKambuhData,
  getKambuhById,
  addKambuhData,
  getPuffData,
  updateCondition,
  getKambuhDataByDate,
  getKambuhDataByMonth,
  getAnalytics,
};
