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
    connectionString: process.env.DATABASE_URL, // This grabs the full URL from the environment variable
});

module.exports.pool = pool;