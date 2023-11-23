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
const getWeekAvgPuff = `SELECT 
    CASE
      WHEN EXTRACT(DAY FROM (puffs.date_time - sub.week_start)) = CAST(0 AS FLOAT) THEN CAST(COUNT(*) AS FLOAT)
      ELSE CAST(COUNT(*) AS FLOAT) / EXTRACT(DAY FROM (puffs.date_time - sub.week_start))
    END AS average
  FROM puffs JOIN (SELECT DATE_TRUNC('week', date_time) AS week_start FROM puffs) AS sub ON sub.week_start = DATE_TRUNC('week', puffs.date_time) GROUP BY sub.week_start, puffs.date_time ORDER BY sub.week_start LIMIT 1`;

// Kambuh
const addKambuhData =
  "INSERT INTO kambuhs (start_time)  VALUES ($1::timestamp)";
const addManualKambuhData = `INSERT INTO kambuhs (start_time, total_puff, "scale", "trigger")  VALUES ($1::timestamp, $2, $3, $4)`;
const getAllKambuhData = "SELECT * FROM kambuhs";
const getKambuhById = "SELECT * FROM kambuhs WHERE kambuhid = $1";
const getLatestKambuh = "SELECT * FROM kambuhs ORDER BY kambuh_id DESC LIMIT 1";
const findKambuhIdByPk = "SELECT * FROM kambuhs WHERE kambuh_id = $1";
const updateKambuh =
  "UPDATE kambuhs SET end_time = $1, total_puff = $2, kambuh_interval = $3 WHERE kambuh_id = $4";
const updateKambuhCondition =
  "UPDATE kambuhs SET scale = $1, trigger = $2 WHERE kambuh_id = $3";
const getKambuhDataByDate = `SELECT *
FROM kambuhs
WHERE date_trunc('day', start_time::date) = date_trunc('day', $1::date)`;
const getKambuhDataByMonth = `SELECT * FROM kambuhs
WHERE date_trunc('month', start_time::date) = date_trunc('month', $1::date)`;
const getKambuhDataIfScaleAndTriggerNull = `SELECT * FROM kambuhs WHERE scale IS NULL AND trigger IS NULL`;
const deleteKambuhDataById = `DELETE FROM kambuhs WHERE kambuh_id = $1`;

// User
const addUserData = 'INSERT INTO users (email, "password") VALUES ($1, $2)';
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
const getWeeklyAnalytics = `
WITH date_series AS (
  SELECT generate_series($1::date - INTERVAL '6 days', $1::date, '1 day')::date AS day
)
SELECT
  SUBSTRING(TO_CHAR(ds.day, 'Day') FROM 1 FOR 1) AS label,
  ds.day as start_date,
  ds.day as end_date,
  COALESCE(p.daytime_usage, 0) AS daytime_usage,
  COALESCE(p.night_usage, 0) AS night_usage
FROM date_series ds
LEFT JOIN (
  SELECT
    DATE_TRUNC('day', start_time)::date AS day,
    SUM(CASE WHEN EXTRACT(HOUR FROM start_time) BETWEEN 7 AND 20 THEN total_puff ELSE 0 END) AS daytime_usage,
    SUM(CASE WHEN EXTRACT(HOUR FROM start_time) BETWEEN 21 AND 23 OR EXTRACT(HOUR FROM date_time) BETWEEN 0 AND 6 THEN total_puff ELSE 0 END) AS night_usage
  FROM kambuhs
  WHERE start_time >= $1 - INTERVAL '6 days'
  AND start_time < $1 + INTERVAL '1 day'
  GROUP BY DATE_TRUNC('day', start_time)
) p ON ds.day = p.day
ORDER BY ds.day;
`;

const getMonthlyAnalytics = `
WITH date_range AS (
  SELECT DATE_TRUNC('month', $1::date)::date AS start_of_month,
         (DATE_TRUNC('month', $1::date) + INTERVAL '1 MONTH - 1 day')::date AS end_of_month
),
weeks AS (
  SELECT generate_series(start_of_month, end_of_month, '1 week'::interval)::date AS week_start,
         LEAST(generate_series(start_of_month, end_of_month, '1 week'::interval) + INTERVAL '6 days', end_of_month)::date AS week_end
  FROM date_range
),
puff_counts AS (
  SELECT DATE_TRUNC('day', date_time)::date AS puff_day_start,
         SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 7 AND 20 THEN 1 ELSE 0 END) as daytimeusage,
         SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 21 AND 23 OR EXTRACT(HOUR FROM date_time) BETWEEN 0 AND 6 THEN 1 ELSE 0 END) as nightusage
  FROM puffs
  WHERE date_time >= (SELECT start_of_month FROM date_range)
    AND date_time <= (SELECT end_of_month FROM date_range)
  GROUP BY puff_day_start
),
weekly_summary AS (
  SELECT w.week_start AS start_date,
         w.week_end AS end_date,
         COALESCE(SUM(pc.daytimeusage), 0) AS daytime_usage,
         COALESCE(SUM(pc.nightusage), 0) AS night_usage
  FROM weeks w
  LEFT JOIN puff_counts pc ON pc.puff_day_start >= w.week_start AND pc.puff_day_start <= w.week_end
  GROUP BY w.week_start, w.week_end
  ORDER BY w.week_start
)
SELECT
  'W' || ROW_NUMBER() OVER (ORDER BY ws.start_date) AS label,
  ws.start_date,
  ws.end_date,
  ws.daytime_usage,
  ws.night_usage
FROM weekly_summary ws;
`;

const getQuarterlyAnalytics = `
WITH date_range AS (
  SELECT (DATE_TRUNC('MONTH', $1::date) - INTERVAL '2 MONTH')::date AS start_of_year,
         (DATE_TRUNC('MONTH', $1::date) + INTERVAL '1 MONTH - 1 day')::date AS end_of_year
),
months AS (
  SELECT generate_series(start_of_year, end_of_year, '1 month'::interval)::date AS month_start,
         (generate_series(start_of_year, end_of_year, '1 month'::interval) + INTERVAL '1 MONTH - 1 day')::date AS month_end
  FROM date_range
),
puff_counts AS (
  SELECT DATE_TRUNC('day', date_time)::date AS puff_day_start,
         SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 7 AND 20 THEN 1 ELSE 0 END) as daytimeusage,
         SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 21 AND 23 OR EXTRACT(HOUR FROM date_time) BETWEEN 0 AND 6 THEN 1 ELSE 0 END) as nightusage
  FROM puffs
  WHERE date_time >= (SELECT start_of_year FROM date_range)
    AND date_time <= (SELECT end_of_year FROM date_range)
  GROUP BY puff_day_start
)
SELECT
SUBSTRING(TO_CHAR(m.month_start, 'Mon') FROM 1 FOR 3) AS label, 
      m.month_start AS start_date,
       m.month_end AS end_date,
       COALESCE(SUM(pc.daytimeusage), 0) AS daytime_usage,
       COALESCE(SUM(pc.nightusage), 0) AS night_usage
FROM months m
LEFT JOIN puff_counts pc ON pc.puff_day_start >= m.month_start AND pc.puff_day_start <= m.month_end
GROUP BY m.month_start, m.month_end
ORDER BY m.month_start;
`;

const getHalfYearlyAnalytics = `
WITH date_range AS (
  SELECT (DATE_TRUNC('MONTH', $1::date) - INTERVAL '5 MONTH')::date AS start_of_year,
         (DATE_TRUNC('MONTH', $1::date) + INTERVAL '1 MONTH - 1 day')::date AS end_of_year
),
months AS (
  SELECT generate_series(start_of_year, end_of_year, '1 month'::interval)::date AS month_start,
         (generate_series(start_of_year, end_of_year, '1 month'::interval) + INTERVAL '1 MONTH - 1 day')::date AS month_end
  FROM date_range
),
puff_counts AS (
  SELECT DATE_TRUNC('day', date_time)::date AS puff_day_start,
         SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 7 AND 20 THEN 1 ELSE 0 END) as daytimeusage,
         SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 21 AND 23 OR EXTRACT(HOUR FROM date_time) BETWEEN 0 AND 6 THEN 1 ELSE 0 END) as nightusage
  FROM puffs
  WHERE date_time >= (SELECT start_of_year FROM date_range)
    AND date_time <= (SELECT end_of_year FROM date_range)
  GROUP BY puff_day_start
)
SELECT
SUBSTRING(TO_CHAR(m.month_start, 'Mon') FROM 1 FOR 3) AS label, 
      m.month_start AS start_date,
       m.month_end AS end_date,
       COALESCE(SUM(pc.daytimeusage), 0) AS daytime_usage,
       COALESCE(SUM(pc.nightusage), 0) AS night_usage
FROM months m
LEFT JOIN puff_counts pc ON pc.puff_day_start >= m.month_start AND pc.puff_day_start <= m.month_end
GROUP BY m.month_start, m.month_end
ORDER BY m.month_start;
`;

const getYearlyAnalytics = `
WITH date_range AS (
  SELECT DATE_TRUNC('year', $1::date)::date AS start_of_year,
         (DATE_TRUNC('year', $1::date) + INTERVAL '1 YEAR - 1 day')::date AS end_of_year
),
months AS (
  SELECT generate_series(start_of_year, end_of_year, '1 month'::interval)::date AS month_start,
         LEAST(generate_series(start_of_year, end_of_year, '1 month'::interval) + INTERVAL '1 MONTH - 1 day', end_of_year)::date AS month_end
  FROM date_range
),
puff_counts AS (
  SELECT DATE_TRUNC('day', date_time)::date AS puff_day_start,
         SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 7 AND 20 THEN 1 ELSE 0 END) as daytime_usage,
         SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 21 AND 23 OR EXTRACT(HOUR FROM date_time) BETWEEN 0 AND 6 THEN 1 ELSE 0 END) as night_usage
  FROM puffs
  WHERE date_time >= (SELECT start_of_year FROM date_range)
    AND date_time <= (SELECT end_of_year FROM date_range)
  GROUP BY puff_day_start
)
SELECT
  SUBSTRING(TO_CHAR(m.month_start, 'Mon') FROM 1 FOR 3) AS label,
  m.month_start AS start_date,
  m.month_end AS end_date,
  COALESCE(SUM(pc.daytime_usage), 0) AS daytime_usage,
  COALESCE(SUM(pc.night_usage), 0) AS night_usage
FROM months m
LEFT JOIN puff_counts pc ON pc.puff_day_start >= m.month_start AND pc.puff_day_start <= m.month_end
GROUP BY m.month_start, m.month_end
ORDER BY m.month_start;
`;

const summaryAnalytics = `
WITH date_range AS (
  SELECT (DATE_TRUNC('MONTH', $1::date) - INTERVAL '5 MONTH')::date AS start_of_year,
         (DATE_TRUNC('MONTH', $1::date) + INTERVAL '1 MONTH - 1 day')::date AS end_of_year
),
months AS (
  SELECT generate_series(start_of_year, end_of_year, '1 month'::interval)::date AS month_start,
         (generate_series(start_of_year, end_of_year, '1 month'::interval) + INTERVAL '1 MONTH - 1 day')::date AS month_end
  FROM date_range
),
puff_counts AS (
  SELECT DATE_TRUNC('day', date_time)::date AS puff_day_start,
         SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 7 AND 20 THEN 1 ELSE 0 END) as daytimeusage,
         SUM(CASE WHEN EXTRACT(HOUR FROM date_time) BETWEEN 21 AND 23 OR EXTRACT(HOUR FROM date_time) BETWEEN 0 AND 6 THEN 1 ELSE 0 END) as nightusage
  FROM puffs
  WHERE date_time >= (SELECT start_of_year FROM date_range)
    AND date_time <= (SELECT end_of_year FROM date_range)
  GROUP BY puff_day_start
),
aggregated_data AS (
  SELECT
    SUBSTRING(TO_CHAR(m.month_start, 'Mon') FROM 1 FOR 3) AS label,
    m.month_start,
    m.month_end,
    COALESCE(SUM(pc.daytimeusage), 0) AS total_daytime_usage,
    COALESCE(SUM(pc.nightusage), 0) AS total_night_usage,
    COALESCE(SUM(pc.daytimeusage+pc.nightusage),0) as total_usage,
    COUNT(*) FILTER (WHERE pc.daytimeusage = 0 AND pc.nightusage = 0) AS days_without_usage
  FROM months m
  LEFT JOIN puff_counts pc ON pc.puff_day_start >= m.month_start AND pc.puff_day_start <= m.month_end
  GROUP BY m.month_start, m.month_end
)
SELECT
  label_highest_usage,
  total_usage_highest,
  label_lowest_usage,
  total_usage_lowest,
  highest_daytime_usage,
  highest_night_usage,
  total_days_without_usage
FROM (
  SELECT
    (SELECT label FROM aggregated_data ORDER BY total_usage DESC LIMIT 1) AS label_highest_usage,
    (SELECT total_usage FROM aggregated_data ORDER BY total_usage DESC LIMIT 1) AS total_usage_highest,
    (SELECT label FROM aggregated_data ORDER BY total_usage ASC LIMIT 1) AS label_lowest_usage,
    (SELECT total_usage FROM aggregated_data ORDER BY total_usage ASC LIMIT 1) AS total_usage_lowest,
    MAX(total_daytime_usage) AS highest_daytime_usage,
    MAX(total_night_usage) AS highest_night_usage,
    SUM(CASE WHEN total_daytime_usage = 0 AND total_night_usage = 0 THEN 1 ELSE 0 END) AS total_days_without_usage
  FROM aggregated_data
) AS summary;
`;

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
  getLatestKambuh,
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
  getKambuhDataByMonth,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getQuarterlyAnalytics,
  getHalfYearlyAnalytics,
  getYearlyAnalytics,
  getKambuhDataIfScaleAndTriggerNull,
  deleteKambuhDataById,
  addManualKambuhData,
  summaryAnalytics,
};
