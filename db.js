require("dotenv").config();

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST, //servidor local
    user: process.env.DB_USER, //usuario que esta utilizando
    password: process.env.DB_PASSWORD, //senha do banco
    database: process.env.DB_NAME, //nome do banco
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool; //permite usarmos a conexão com o banco de daods em outros arquivos, no caso o server.js