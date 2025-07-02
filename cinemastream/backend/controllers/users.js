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
      SELECT *
      FROM users
      WHERE id = $1;
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
    const { firstName, lastName, email, status } = req.body;
    const sql = `
      INSERT INTO users (firstName, lastName, email, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [firstName, lastName, email, status]);
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
    const { firstName, lastName, email, status } = req.body;
    const sql = `
      UPDATE users
      SET firstName = $1, lastName = $2, email = $3, status = $4
      WHERE id = $5
      RETURNING *;
    `;
    const { rows } = await pool.query(sql, [firstName, lastName, email, status, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      DELETE FROM users
      WHERE id = $1
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

