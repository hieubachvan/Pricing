import axios from 'axios';
import * as xml2js from 'xml2js';
import prisma from '../prismaClient';

const SJC_URL = 'https://sjc.com.vn/xml/tygiavang.xml';
const VCB_URL = 'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=68';

export async function fetchSJCPrices() {
  try {
    const response = await axios.get(SJC_URL);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    
    // Result structure: root.ratelist[0].city[0].item
    const cities = result.root?.ratelist?.[0]?.city;
    if (!cities) return;
    
    const hcmCity = cities.find((c: any) => c.$.name.includes('Hồ Chí Minh') || c.$.name.includes('Ho Chi Minh'));
    if (!hcmCity) return;

    const sjcItem = hcmCity.item.find((i: any) => i.$.type.includes('SJC 1L') || i.$.type.includes('SJC'));
    if (!sjcItem) return;

    // SJC prices are often in strings like "82500000" or similar based on XML schema. We parse it:
    let buyPriceStr = sjcItem.$.buy.replace(/,/g, '');
    let sellPriceStr = sjcItem.$.sell.replace(/,/g, '');
    let buyPrice = parseFloat(buyPriceStr);
    let sellPrice = parseFloat(sellPriceStr);
    
    // If the price is something like 82.5, it usually means 82,500,000 VND
    if (buyPrice < 1000) {
      buyPrice = buyPrice * 1000000;
      sellPrice = sellPrice * 1000000;
    }
    
    await prisma.priceRecord.create({
      data: {
         symbol: 'SJC',
         category: 'GOLD',
         buyPrice,
         sellPrice,
         source: 'SJC_XML',
         recordedAt: new Date()
      }
    });
    console.log('SJC Prices updated successfully');
  } catch (error) {
    console.error('Error fetching SJC prices:', error);
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
    fetchSJCPrices(),
    fetchVCBRates(),
    fetchPNJMock(),
    fetchDOJIMock()
  ]);
  console.log('Finished all crawlers');
}
