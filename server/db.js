const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "BuskistheBest1",
  host: "localhost",
  port: 5432,
  database: "benjamincleek"
});

module.exports = pool