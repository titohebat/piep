const { Client } = require('pg');
const client = new Client({
  user: "11",
  host: "1111",
  database: "11",
  password: "1",
  port: 11,
});
client.connect(function(err) {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = client;
