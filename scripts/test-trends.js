import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchGoogleTrends() {
  try {
    const res = await axios.get('https://trends.google.com/trending/rss?geo=KR');
    const $ = cheerio.load(res.data, { xmlMode: true });
    const items = $('item title').map((i, el) => $(el).text()).get().slice(0, 10);
    console.log("Trends:", items);
  } catch (error) {
    console.error(error.message);
  }
}

fetchGoogleTrends();
