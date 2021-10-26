const mysql2 = require('mysql2/promise');

const dbPromise = mysql2.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: 'employees_db',
        password: process.env.DB_PASS
    });

module.exports = dbPromise;