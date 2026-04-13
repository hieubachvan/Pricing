import prisma from '../prismaClient';

export async function processPriceAlerts() {
  console.log('Checking for triggered alerts...');
  try {
    // 1. Fetch active alerts
    const alerts = await prisma.alertRule.findMany({
      where: { isActive: true },
      include: { user: true }
    });

    // 2. Fetch latest prices for symbols
    const uniqueSymbols = [...new Set(alerts.map(a => a.symbol))];
    const latestPrices = await prisma.priceRecord.findMany({
      distinct: ['symbol'],
      orderBy: { recordedAt: 'desc' },
      where: { symbol: { in: uniqueSymbols } }
    });

    const priceMap = new Map();
    latestPrices.forEach(p => priceMap.set(p.symbol, p));

    // 3. Evaluate alerts
    for (const alert of alerts) {
      const priceRecord = priceMap.get(alert.symbol);
      if (!priceRecord) continue;

      const currentPrice = alert.targetField === 'BUY' ? priceRecord.buyPrice : priceRecord.sellPrice;
      if (!currentPrice) continue;

      let isTriggered = false;
      if (alert.condition === 'GREATER_THAN' && currentPrice >= alert.threshold) {
        isTriggered = true;
      } else if (alert.condition === 'LESS_THAN' && currentPrice <= alert.threshold) {
        isTriggered = true;
      }

      if (isTriggered && alert.user.expoToken) {
        // Send Expo Push Notification
        // In real app: use expo-server-sdk
        console.log(`[PUSH NOTIFICATION] To ${alert.user.expoToken}: ${alert.symbol} ${alert.targetField} has reached ${currentPrice}!`);
        
        // Disable alert after triggering one-time
        await prisma.alertRule.update({
          where: { id: alert.id },
          data: { isActive: false }
        });
      }
    }
  } catch (err) {
    console.error('Error processing alerts:', err);
  }
}
