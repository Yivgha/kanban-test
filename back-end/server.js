const express = require('express');

const cors = require('cors');

const { Client } = require('pg');

require('path');
require('dotenv').config({ path: '../.env' });

const PORT = 3001;

const app = express();
app.use(cors());

async function connectWithRetry() {
  try {
    const client = new Client({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    });

    console.log('CLIENT', process.env.PGDATABASE);

    await client.connect();
    console.log('Connected to the database successfully');
    return client;
  } catch (error) {
    console.error(`Database connection attempt ${attempt + 1} failed:`, error);

    process.exit(1);
  }
}

connectWithRetry();

app.get('/', (req, res) => {
  res.send('Hello, world! 111');
});

app.listen(PORT, () => {
  console.log('listening to port: ', PORT);
});

