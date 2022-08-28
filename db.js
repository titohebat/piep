const { Client } = require('pg');
const client = new Client({
  user: "extraction",
  host: "34.101.122.219",
  database: "piep",
  password: "QJHxaBEyRLjt123",
  port: 5432,
});
client.connect(function(err) {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = client;