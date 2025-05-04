/* async function createUser(first_name, last_name, email, password)
{
    const query = `INSERT INTO users (first_name, last_name, email,
        password) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [first_name, last_name, email, password];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
}

module.exports = { createUser }; */
/* 
const pool = require('../config/db'); // Assuming this is where your db pool is

async function createUser(first_name, last_name, email, password, verification_token) {
    const query = `
        INSERT INTO users (first_name, last_name, email, password, is_verified, verification_token)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [first_name, last_name, email, password, false, verification_token];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
}

module.exports = { createUser }; */

const pool = require('../config/db');

const createUser = async (first_name, last_name, email, hashedPassword, otp, otpExpiry) => {
    await pool.query(
        'INSERT INTO users (first_name, last_name, email, password, verification_token, otp_expiry, is_verified) VALUES ($1, $2, $3, $4, $5, $6, false)',
        [first_name, last_name, email, hashedPassword, otp, otpExpiry]
    );
};

module.exports = {
    createUser
};
