import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

// 마법의 자동 배포 플러그인
function autoDeployPlugin() {
  return {
    name: 'auto-deploy-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/deploy' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
             try {
               // 1. content.json 파일에 내용 덮어쓰기
               const filePath = path.resolve(__dirname, 'src/data/content.json');
               // 포맷팅 예쁘게 해서 저장
               fs.writeFileSync(filePath, JSON.stringify(JSON.parse(body), null, 2));

               // 2. 백그라운드 깃허브 명령어 실행
               const gitCommand = '"C:\\Program Files\\Git\\cmd\\git.exe" add . && "C:\\Program Files\\Git\\cmd\\git.exe" commit -m "Auto deploy from Admin" && "C:\\Program Files\\Git\\cmd\\git.exe" push origin HEAD:main';
               
               exec(gitCommand, { cwd: __dirname }, (error, stdout, stderr) => {
                 res.setHeader('Content-Type', 'application/json');
                 if (error) {
                   res.statusCode = 500;
                   res.end(JSON.stringify({ success: false, error: error.message, stderr }));
                   return;
                 }
                 res.end(JSON.stringify({ success: true, stdout }));
               });
             } catch(err) {
               res.statusCode = 500;
               res.end(JSON.stringify({ success: false, error: err.message }));
             }
          });
        } else if (req.url === '/api/naver-trends' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', async () => {
             try {
               const { keywords } = JSON.parse(body);
               if (!keywords || keywords.length === 0) throw new Error('No keywords');
               
               const clientId = 'GYWQrl7X9m5Le39N9HiO';
               const clientSecret = 'N8lFz2MJo9';
               
               const today = new Date();
               const endDate = today.toISOString().split('T')[0];
               const startDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split('T')[0];
               
               const results = [];
               const baseline = keywords[0];
               const chunks = [];
               for (let i = 1; i < keywords.length; i += 4) {
                 chunks.push(keywords.slice(i, i + 4));
               }
               if (keywords.length === 1) chunks.push([]);
               
               let baselineMaxRatio = 100;
               
               for (let i = 0; i < chunks.length; i++) {
                 const chunk = chunks[i];
                 const keywordGroups = [
                   { groupName: baseline, keywords: [baseline] },
                   ...chunk.map(kw => ({ groupName: kw, keywords: [kw] }))
                 ];
                 
                 const response = await fetch('https://openapi.naver.com/v1/datalab/search', {
                   method: 'POST',
                   headers: {
                     'X-Naver-Client-Id': clientId,
                     'X-Naver-Client-Secret': clientSecret,
                     'Content-Type': 'application/json'
                   },
                   body: JSON.stringify({ startDate, endDate, timeUnit: 'date', keywordGroups })
                 });
                 
                 const data = await response.json();
                 if (data.errorCode) throw new Error(data.errorMessage);
                 
                 const baselineData = data.results.find(r => r.title === baseline);
                 const recentBaselineRatio = baselineData.data.slice(-7).reduce((sum, item) => sum + item.ratio, 0) / 7;
                 
                 let normalizationFactor = 1;
                 if (i === 0) {
                   baselineMaxRatio = recentBaselineRatio;
                 } else {
                   normalizationFactor = baselineMaxRatio / (recentBaselineRatio || 1);
                 }
                 
                 data.results.forEach(result => {
                   if (i > 0 && result.title === baseline) return;
                   const recentRatio = result.data.slice(-7).reduce((sum, item) => sum + item.ratio, 0) / 7;
                   results.push({ keyword: result.title, score: recentRatio * normalizationFactor });
                 });
               }
               
               results.sort((a, b) => b.score - a.score);
               
               res.setHeader('Content-Type', 'application/json');
               res.end(JSON.stringify({ trends: results.map(r => r.keyword) }));
             } catch(err) {
               res.statusCode = 500;
               res.end(JSON.stringify({ error: err.message }));
             }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), autoDeployPlugin()],
  server: {
    port: 5173,
    strictPort: true,
    open: true
  }
})
