const mysql = require('mysql2');

const initialConnection = mysql.createConnection({
  host: 'localhost',
  user: 'AV_User',
  password: 'sn',
  database: 'absolventenverein'
});

initialConnection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL server as connect_user.');
});

module.exports = initialConnection;