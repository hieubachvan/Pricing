import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get latest prices
router.get('/prices/latest', async (req, res) => {
  try {
    const latestPrices = await prisma.priceRecord.findMany({
      distinct: ['symbol'],
      orderBy: { recordedAt: 'desc' },
    });
    res.json(latestPrices);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get price history for chart
router.get('/prices/history/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const history = await prisma.priceRecord.findMany({
      where: { symbol },
      orderBy: { recordedAt: 'asc' },
      take: 100 // limit to last 100 records for performance
    });
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Configure Alerts (simplified)
router.post('/alerts', async (req, res) => {
  try {
    const { expoToken, symbol, condition, targetField, threshold } = req.body;
    
    // Upsert User
    const user = await prisma.user.upsert({
      where: { expoToken },
      update: {},
      create: { expoToken }
    });

    const alert = await prisma.alertRule.create({
      data: {
        userId: user.id,
        symbol,
        condition,
        targetField,
        threshold: parseFloat(threshold)
      }
    });

    res.json(alert);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Manual crawler trigger (for testing)
router.all('/crawl-now', async (req, res) => {
  try {
    const { runAllCrawlers } = require('../services/crawler');
    // Using require here to avoid circular dependencies if any, though imports work too
    await runAllCrawlers();
    res.json({ success: true, message: 'Crawlers executed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
