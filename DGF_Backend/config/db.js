//config/db.js
const mysql = require('mysql2');
require('dotenv').config();

// MySQL Database Configuration
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dgf_dummy', // Replace with your actual database name
});

module.exports = pool;
