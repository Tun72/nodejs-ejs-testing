// const mysql = require("mysql2");

// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     database: "blog",
//     password: ""
// })

// module.exports = pool.promise()

const Sequelize = require("sequelize");

const sequelize = new Sequelize("blog", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
