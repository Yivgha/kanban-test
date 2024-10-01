import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;

dotenv.config({ path: '../.env' });

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

    await client.connect();
    console.log('Connected to the database successfully');

    return client;
  } catch (error) {
    console.error('Database connection attempt failed:', error);
    return null;
  }
}

async function startServer() {
  const client = await connectWithRetry();

  if (client) {
    app.get('/', (req, res) => {
      res.send('Hello, world! Test 1.1.4');
    });

    app.listen(process.env.PORT, () => {
      console.log('Listening to port: ', process.env.PORT);
    });
  } else {
    console.error('Server failed to start due to database connection issues.');
    process.exit(1);
  }
}

startServer();
