const pool = require("../database/database");
const queries = require("./query");

const getInhalerData = async (req, res, next) => {
  pool.query(queries.getAllInhalersData, (error, results) => {
    if (error) throw error;
    res.status(200).json({result: results.rows});
  });
};

const addInhalerData = async (req, res, next) => {
  try {
    const { inhaler_id } = req.body;

    if (!inhaler_id) {
      return res.status(400).json({ message: "inhaler_id is required." });
    }
    await pool.query(queries.addInhalerData, [inhaler_id]);

    res.status(201).json({
      message: "Inhaler data added successfully",
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: error.message
    });
  }
};

const updateInhalerData = async (req, res, next) => {
  try {
    const inhaler_id = req.params.inhaler_id;
    const { inhaler_name } = req.body;
    await pool.query(queries.updateInhalerData, [inhaler_id, inhaler_name]);
    res.status(200).json({
      message: "Inhaler data updated successfully",
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: error.message
    });
  }
};

const updateBottleInhaler = async (req, res, next) => {
  try {
    const inhaler_id = req.params.inhaler_id;
    const { remaining_puff } = req.body;
    const now = new Date();

    if(!inhaler_id) {
      return res.status(400).json({ message: 'inhaler_id is required'});
    } else {
      const inhaler = await pool.query(queries.getInhalerById, [inhaler_id]);
      if (!inhaler.rows.length) {
        return res.status(400).json({ message: 'No Data inhaler'});
      } else {
        await pool.query(queries.updateBottleInhaler, [now,  remaining_puff ? remaining_puff : 200, inhaler_id]);
        return res.status(200).json({
          message: 'Inhaler bottle update succesfully',
          data: inhaler.rows
        });
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getInhalerData,
  addInhalerData,
  updateInhalerData,
  updateBottleInhaler
};