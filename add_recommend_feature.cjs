const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

// 1. Update imports
code = code.replace(
  "import { generateTistoryPost } from '../utils/gemini';",
  "import { generateTistoryPost, recommendImageAndLink } from '../utils/gemini';"
);

// 2. Add state
const stateTarget = "const [tistoryAiResult, setTistoryAiResult] = useState(null);";
const stateReplacement = \`const [tistoryAiResult, setTistoryAiResult] = useState(null);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState(null);\`;
code = code.replace(stateTarget, stateReplacement);

// 3. Add handler function
const handlerTarget = "  const handleGenerateTistoryAi = async () => {";
const handlerReplacement = \`  const handleGetRecommendation = async () => {
    if (!tistoryKeyword.trim()) {
      alert('키워드를 먼저 입력해주세요.');
      return;
    }
    setRecommendLoading(true);
    setRecommendationResult(null);
    try {
      const result = await recommendImageAndLink(tistoryKeyword);
      setRecommendationResult(result);
    } catch (err) {
      alert("추천 실패: " + err.message);
    } finally {
      setRecommendLoading(false);
    }
  };

  const handleGenerateTistoryAi = async () => {\`;
code = code.replace(handlerTarget, handlerReplacement);

// 4. Update UI to include recommendation button and result box
const uiTarget = \`              <input 
                type="text" 
                value={tistoryKeyword}
                onChange={(e) => setTistoryKeyword(e.target.value)}
                placeholder="키워드를 입력하거나 좌측 트렌드를 클릭하세요."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition font-bold text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateTistoryAi()}
              />\`;

const uiReplacement = \`              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={tistoryKeyword}
                  onChange={(e) => setTistoryKeyword(e.target.value)}
                  placeholder="키워드를 입력하거나 좌측 트렌드를 클릭하세요."
                  className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition font-bold text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateTistoryAi()}
                />
                <button
                  onClick={handleGetRecommendation}
                  disabled={recommendLoading}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold px-6 py-4 rounded-2xl transition disabled:bg-slate-100 disabled:text-slate-400 shrink-0 flex items-center justify-center gap-2"
                >
                  {recommendLoading ? '분석 중...' : '💡 링크/이미지 추천'}
                </button>
              </div>
              
              {recommendationResult && (
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-2 animate-fade-in text-sm text-indigo-900 whitespace-pre-wrap leading-relaxed shadow-sm">
                  <strong className="flex items-center gap-1 text-indigo-700 mb-2"><span className="text-base">💡</span> AI 전략 추천</strong>
                  {recommendationResult}
                </div>
              )}\`;
code = code.replace(uiTarget, uiReplacement);

fs.writeFileSync('src/pages/Admin.jsx', code, 'utf8');
console.log('Admin.jsx updated with recommendation feature');
