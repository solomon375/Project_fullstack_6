const mysql = require('mysql2');

// שימוש ב-Pool כדי לנהל חיבורים מרובים ביעילות
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Eliors&26',
    database: 'school_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();