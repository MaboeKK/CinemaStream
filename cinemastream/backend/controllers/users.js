const pool = require("../config/db");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const sql = `
      SELECT *
      FROM users;
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT user_id, first_name, last_name, email, role, is_verified
      FROM users
      WHERE user_id = $1;
    `;
    const { rows } = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, role } = req.body;
    const sql = `
      INSERT INTO users (first_name, last_name, email, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [first_name, last_name, email, role]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role } = req.body;
    const sql = `
      UPDATE users
      SET first_name = $1, last_name = $2, email = $3, role = $4
      WHERE user_id = $5
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [first_name, last_name, email, role, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Verify user
exports.verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      UPDATE users
      SET is_verified = TRUE
      WHERE user_id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User verified successfully" });
  } catch (err) {
    console.error("Error verifying user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      DELETE FROM users
      WHERE user_id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};