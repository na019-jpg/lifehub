import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 향후 실제 도메인으로 변경해야 합니다.
const DOMAIN = 'https://lifestyle-hub.co.kr';

function generateSeo() {
  const contentPath = path.resolve(__dirname, '../src/data/content.json');
  const rawData = fs.readFileSync(contentPath, 'utf-8');
  const data = JSON.parse(rawData);

  const urls = [
    { loc: `${DOMAIN}/`, priority: 1.0, changefreq: 'daily' },
  ];

  // Add categories
  if (data.categories) {
    data.categories.forEach(cat => {
      urls.push({ loc: `${DOMAIN}/category/${cat.id}`, priority: 0.8, changefreq: 'weekly' });
    });
  }

  // Add posts
  if (data.posts) {
    data.posts.forEach(post => {
      const lastMod = post.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      urls.push({ loc: `${DOMAIN}/post/${post.slug || post.id}`, priority: 0.9, changefreq: 'monthly', lastmod: lastMod });
    });
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemapXml);
  fs.writeFileSync(path.resolve(publicDir, 'robots.txt'), robotsTxt);

  console.log('✅ Generated sitemap.xml and robots.txt successfully.');
}

generateSeo();
