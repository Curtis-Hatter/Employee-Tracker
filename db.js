const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port, if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: 'Ch@tt259263',
    database: 'Company_db',
});

module.exports = connection;