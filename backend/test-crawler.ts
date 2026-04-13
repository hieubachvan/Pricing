import axios from 'axios';
import * as cheerio from 'cheerio';

const GOLD_24H_URL = 'https://www.24h.com.vn/gia-vang-hom-nay-c425.html';

async function test() {
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
       if (!title) return;
       const buyStr = $(element).find('span.buy:not(.sell) strong').text().trim().replace(/,/g, '');
       const sellStr = $(element).find('span.buy.sell strong').text().trim().replace(/,/g, '');
       
       console.log(`Title: ${title} | Buy: ${buyStr} | Sell: ${sellStr}`);
    });
  } catch (error: any) {
      console.log('Failed to fetch:', error.message);
  }
}

test();
