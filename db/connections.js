const mysql = require("mysql2");

//connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "vegetable",
    database: "employee_tracker",
  },
  //console.log("connected to the employee_tracker database")
);

module.exports = db;