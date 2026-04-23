import axios from 'axios';
import * as cheerio from 'cheerio';

async function t() {
  const { data } = await axios.get('https://news.google.com/rss/search?q=%EC%83%9D%ED%99%9C%EA%BF%80%ED%8C%81&hl=ko&gl=KR&ceid=KR:ko');
  const $ = cheerio.load(data, { xmlMode: true });
  console.log($('item').length);
}
t();
