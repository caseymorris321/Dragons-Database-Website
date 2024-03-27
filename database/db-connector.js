// // Get an instance of mysql we can use in the app
// var mysql = require('mysql')

// // Create a 'connection pool' using the provided credentials
// var pool = mysql.createPool({
//     connectionLimit : 10,
//     host            : 'process.env.DB_HOST',
//     user            : 'process.env.DB_USER',
//     password        : 'process.env.DB_PASSWORD',
//     database        : 'process.env.DB_NAME'
// })

// // Export it for use in our application
// module.exports.pool = pool;

const { Pool } = require('pg');

const pool = new Pool({
    max: 10, // Set pool max size to 10
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

module.exports.pool = pool