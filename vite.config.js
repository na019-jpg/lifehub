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
               const gitCommand = '"C:\\Program Files\\Git\\cmd\\git.exe" add . && "C:\\Program Files\\Git\\cmd\\git.exe" commit -m "Auto deploy from Admin" && "C:\\Program Files\\Git\\cmd\\git.exe" push origin main';
               
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
})
