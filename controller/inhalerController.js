const pool = require("../database/database");
const queries = require("./query");

const getInhalerData = async (req, res, next) => {
  pool.query(queries.getAllInhalersData, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

// const addInhalerData = async (req, res, next) => {
//   const { inhaler_id, inhaler_name } = req.body;
//   print(inhaler_id, inhaler_name);

//   if (!inhaler_id) {
//     return res.status(400).json({ error: "inhaler_id is required." });
//   }

//   pool.query(queries.addInhalerData, (error, results) => {
//     if (error) throw error;
//     res.status(201).json({ message: "Inhaler data added successfully" });
//   });
// };

module.exports = {
  getInhalerData,
  // addInhalerData,
};
