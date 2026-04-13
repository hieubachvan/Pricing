import { fetch24hGoldPrices } from './src/services/crawler';
import prisma from './src/prismaClient';

async function main() {
    console.log('Starting explicit crawl...');
    await fetch24hGoldPrices();
    
    console.log('Validating database...');
    const records = await prisma.priceRecord.findMany({
        where: { source: '24H_CRAWL' }
    });
    console.log('Database Records successfully confirmed:', records.length);
}

main().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
