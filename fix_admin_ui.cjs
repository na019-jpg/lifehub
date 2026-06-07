const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

const targetStartIndex = code.indexOf('<p className="text-xs text-indigo-600 mb-4 font-medium leading-relaxed">');
const targetEndIndex = code.indexOf('</div>', code.indexOf('{todaysTrends[activeCategory].map(')) + 6;

if (targetStartIndex === -1 || targetEndIndex === -1) {
  console.error("Could not find the target UI code");
  process.exit(1);
}

const oldUI = code.substring(targetStartIndex, targetEndIndex);

const newUI = `<p className="text-xs text-indigo-600 mb-4 font-medium leading-relaxed">
              현재 선택된 <strong className="font-bold">[{CATEGORIES.find(c => c.id === activeCategory)?.name}]</strong> 카테고리의 실제 네이버 급상승 키워드입니다. (최근 30일 기준)
            </p>
            
            <div className="flex flex-col gap-2 min-h-[400px]">
              {trendsLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-10 opacity-60">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                  <p className="text-xs font-bold text-indigo-700">네이버 검색량 분석 중...</p>
                </div>
              ) : (
                trendingKeywords.map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => handleTrendClick(keyword)}
                    className="flex items-center text-left bg-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 border border-transparent transition-all group animate-fade-in"
                    style={{ animationDelay: \`\${index * 0.05}s\` }}
                  >
                    <span className={\`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 
                      \${index < 3 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}\`}>
                      {index + 1}
                    </span>
                    <span className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors flex-1">{keyword}</span>
                    {index < 3 && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">HOT</span>}
                  </button>
                ))
              )}
            </div>`;

code = code.substring(0, targetStartIndex) + newUI + code.substring(targetEndIndex);

fs.writeFileSync('src/pages/Admin.jsx', code, 'utf8');
console.log('Successfully replaced UI in Admin.jsx');
