import axios from 'axios';
import * as xml2js from 'xml2js';
import * as cheerio from 'cheerio';
import prisma from '../prismaClient';

const GOLD_24H_URL = 'https://www.24h.com.vn/gia-vang-hom-nay-c425.html';
const VCB_URL = 'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=68';

export async function fetch24hGoldPrices() {
  try {
    const response = await axios.get(GOLD_24H_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    
    const records: any[] = [];

    $('.cate-24h-kd-ex-rate__slide-items > div').each((_, element) => {
       const title = $(element).find('span.title').text().trim();
       if (!title || !['SJC', 'BTMH'].includes(title.toUpperCase())) return;

       const buyStr = $(element).find('span.buy:not(.sell) strong').text().trim().replace(/,/g, '');
       const sellStr = $(element).find('span.buy.sell strong').text().trim().replace(/,/g, '');
       
       if (!buyStr || !sellStr) return;

       let buyPrice = parseFloat(buyStr);
       let sellPrice = parseFloat(sellStr);
       
       // Convert displayed format (e.g. 168500) natively to VND
       // 168500 in 24h usually means 168,500,000 VND
       if (buyPrice > 0 && buyPrice < 1000000) {
           buyPrice = buyPrice * 1000;
           sellPrice = sellPrice * 1000;
       }

       records.push({
         symbol: title.toUpperCase(),
         category: 'GOLD',
         buyPrice,
         sellPrice,
         source: '24H_CRAWL',
         recordedAt: new Date()
       });
    });

    if (records.length > 0) {
       await prisma.priceRecord.createMany({ data: records });
       console.log('24h Gold Prices updated successfully. Count: ' + records.length);
    }
  } catch (error) {
    console.error('Error fetching 24h gold prices:', error);
  }
}

export async function fetchVCBRates() {
  try {
    const response = await axios.get(VCB_URL);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);

    const rates = result.ExrateList?.Exrate;
    if (!rates) return;
    
    const targetCurrencies = ['USD', 'EUR', 'JPY', 'GBP'];

    const records = rates
      .filter((r: any) => targetCurrencies.includes(r.$.CurrencyCode))
      .map((r: any) => ({
        symbol: r.$.CurrencyCode + '/VND',
        category: 'FOREX',
        buyPrice: parseFloat(r.$.Buy.replace(/,/g, '')),
        sellPrice: parseFloat(r.$.Sell.replace(/,/g, '')),
        source: 'VCB',
        recordedAt: new Date()
      }));

    if (records.length > 0) {
      await prisma.priceRecord.createMany({
        data: records
      });
      console.log('VCB Rates updated successfully');
    }
  } catch (error) {
    console.error('Error fetching VCB rates:', error);
  }
}

// Mocking PNJ and DOJI to ensure systems work for MVP without brittle web scraping. 
// Can be replaced with actual Cheerio HTML scraping if needed.
export async function fetchPNJMock() {
   await prisma.priceRecord.create({
      data: {
         symbol: 'PNJ',
         category: 'GOLD',
         buyPrice: 80000000 + Math.random() * 1000000,
         sellPrice: 82000000 + Math.random() * 1000000,
         source: 'PNJ_MOCK',
         recordedAt: new Date()
      }
   });
}

export async function fetchDOJIMock() {
   await prisma.priceRecord.create({
      data: {
         symbol: 'DOJI',
         category: 'GOLD',
         buyPrice: 80500000 + Math.random() * 1000000,
         sellPrice: 82500000 + Math.random() * 1000000,
         source: 'DOJI_MOCK',
         recordedAt: new Date()
      }
   });
}

export async function runAllCrawlers() {
  console.log('Running all crawlers at:', new Date().toISOString());
  await Promise.all([
    fetch24hGoldPrices(),
    fetchVCBRates(),
    fetchPNJMock(),
    fetchDOJIMock()
  ]);
  console.log('Finished all crawlers');
}
