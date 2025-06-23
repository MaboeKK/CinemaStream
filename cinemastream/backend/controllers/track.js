// controllers/trackController.js
const pool = require("../config/db");

const trackView = async (req, res) => {
  const { userId, movieId, eventType } = req.body;

  try {
    await pool.query(
      `INSERT INTO view_events (user_id, movie_id, event_type)
       VALUES ($1, $2, $3)`,
      [userId || null, movieId || null, eventType || 'page_view']
    );

    res.status(201).json({ message: "Event tracked successfully" });
  } catch (err) {
    console.error("Error tracking event:", err);
    res.status(500).json({ error: "Error saving event" });
  }
};

module.exports = { trackView };

