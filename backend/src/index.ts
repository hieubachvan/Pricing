import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { runAllCrawlers } from './services/crawler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// CRON JOB: Run every hour at minute 0
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled crawlers...');
  await runAllCrawlers();
  // Here we would also trigger notification processing
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
