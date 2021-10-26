const mysql2 = require('mysql2');

const db = await mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: 'employees_db',
    password: process.env.DB_PASS
});

module.exports = db;