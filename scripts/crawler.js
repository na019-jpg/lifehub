import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 환경 변수 설정
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("오류: .env 파일에 GEMINI_API_KEY가 없습니다.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
// 구글 최신 플래시 모델 적용
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// 100가지 생활 꿀팁 생성용 무작위 키워드 풀 (계속 추가 가능)
const LIFESTYLE_KEYWORDS = [
  "도마 김칫국물 제거", "수건 쉰내 제거", "화장실 거울 물때", "스텐 냄비 연마제", 
  "싱크대 배수구 악취", "세탁기 통세척 방법", "옷에 묻은 커피 얼룩", "베개솜 세탁법",
  "프라이팬 기름때 분해", "운동화 냄새 제거", "욕실 바닥 곰팡이", "창틀 먼지 청소",
  "누렇게 변한 흰티 복원", "니트 보풀 제거", "셔츠 목때 제거", "냉장고 김치냄새 탈취",
  "여름철 초파리 퇴치", "가죽 소파 얼룩 닦기", "전자레인지 찌든때", "에어컨 필터 청소",
  "러그 먼지 제거", "빨래 쉰내 해결법", "샤워기 헤드 물때 제거", "탄 냄비 복구법",
  "반찬통 냄새 제거", "검은옷 먼지 제거", "구겨진 옷 펴는 법", "스티커 끈끈이 지우기",
  "매트리스 진드기 차단", "패딩 숨 죽은거 살리기"
];

// 타겟 개수
const POSTS_TO_GENERATE = 3;

// 키워드 무작위 추출 함수
function getRandomKeywords(count) {
  const shuffled = LIFESTYLE_KEYWORDS.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function generateStructuredContent(keyword) {
  const prompt = `
당신은 트래픽을 유도하고 제휴 마케팅 수익을 창출하는 '수익형 블로그 탑티어 에디터'입니다.
다음 키워드에 맞춰서 엄청나게 유익하고 구체적인 블로그 포스트 데이터를 처음부터 끝까지 창작해주세요: "${keyword}"

현재 사이트는 다음 카테고리 트리 구조를 사용합니다 (반드시 이 표에 있는 Main Category 영문 ID와 서브카테고리 한글명 중 딱 1개씩만 골라야 합니다):

1. 청소(clean) - 주방, 욕실, 거실, 침실, 베란다/창문, 유리/거울, 스테인리스, 나무/원목, 플라스틱, 패브릭/천, 기름때, 물때/석회, 곰팡이, 음식 얼룩, 냄새 제거, 천연 세제, 상업용 세제, 청소도구, 일일 청소, 주간 청소, 계절 대청소
2. 세탁(laundry) - 면/폴리에스터, 니트/울, 데님, 기능성 의류, 속옷/양말, 손세탁, 세탁기 사용법, 온수/냉수 선택, 건조 방법, 기름 얼룩, 커피/와인, 피/땀, 잉크, 옷 줄이기/늘어나기 방지, 탈색 방지, 계절 보관
3. 요리(cook) - 삶기/찌기, 굽기/볶기, 튀기기, 끓이기, 채소, 육류, 생선/해산물, 계란/두부, 국/찌개, 반찬, 면 요리, 간단 한끼, 칼질, 불 조절, 간 맞추기, 냉장/냉동 보관, 유통기한 판단, 해동 방법
4. 정리·수납(organize) - 옷장, 주방 수납, 냉장고 정리, 책상/서류, 미니멀리즘, 카테고리 정리, 동선 기반 정리, 재정리 주기, 물건 줄이기 기준
5. 생활 유지관리(maintenance) - 냉장고 관리, 세탁기 관리, 에어컨 관리, 전자레인지 관리, 필터 교체, 배터리, 전구, 배수구 막힘, 문/경첩 문제, 실리콘 보수
6. 위생·건강(hygiene) - 손 씻기, 구강 관리, 피부 관리, 침구 관리, 수건 관리, 공기질 관리
7. 절약·효율(efficiency) - 전기/수도 절약, 식비 절약, 루틴화, 자동화
8. 문제 해결(troubleshoot) - 음식 냄새, 하수구 냄새, 벌레, 곰팡이 재발, 얼룩 즉시 제거, 음식 상함 대응
9. 생활 노하우(lifehack) - 베이킹소다 활용, 식초 활용, 빠른 청소법, 즉석 요리법
[필수 작성 가이드라인]
1. 분량: 모든 텍스트를 합쳐서 공백 제외 최소 1,200자 이상으로 매우 상세하게 작성하세요. 대충 넘기지 말고 구체적인 수치, 이유, 원리를 꽉 꽉 채워주세요.
2. 문체: AI 느낌이 전혀 나지 않도록 친근하고 호소력 짙은 30대 주부 블로거 구어체를 사용하세요 ("~했어요", "~랍니다", "진짜 신기하죠?"). 
3. 필수 내용: '실제 경험담(내가 겪었던 고충과 해결했을 때의 쾌감)'과 '전문가적 조언(왜 이 방법이 과학적으로 통하는지)'을 본문에 반드시 녹여내세요.
4. 서식: 본문의 가독성을 극대화하기 위해 각 항목의 텍스트 안에 HTML 태그(<br>, <strong>, <h3>)를 자유롭게 섞어서 작성하세요. (단, JSON 구조는 깨뜨리지 말 것)

응답은 구글 검색 1위를 할 수 있도록 풍부하고 가독성 높게 작성해야 하며, 반드시 다음 JSON 형식에 정확히 맞춰서 반환하세요.
**반드시 \`categoryId\`와 위 표에 있는 정확한 \`subcategory\` 문자열을 선택해 응답에 포함시켜야 합니다.**

키워드: "\${keyword}"

{
  "title": "클릭을 유도하는 매력적이고 자극적인 15자 내외 제목",
  "summary": "1~2문장의 핵심 요약 (구글 스니펫용)",
  "categoryId": "clean, laundry, cook, organize, maintenance, hygiene, efficiency, troubleshoot, lifehack 중 가장 적합한 1개 영문 ID",
  "subcategory": "위에서 선택한 카테고리에 속한 정확한 한글 서브카테고리 이름 1개",
  "problem": "이 문제가 발생하는 일반적인 상황 (공감 유발 경험담 포함하여 300자 이상. <br> 태그 등 사용)",
  "cause": "이 문제가 생기는 과학적/물리적 원인과 전문가적 조언 (300자 이상)",
  "solution": [
    "<h3>1단계: 첫 번째 핵심 비법</h3><br>여기에 엄청 구체적인 행동 지침과 이유를 적으세요.",
    "<h3>2단계: 두 번째 핵심 비법</h3><br>여기에 엄청 구체적인 행동 지침과 이유를 적으세요.",
    "<h3>3단계: 마지막 마무리</h3><br>여기에 엄청 구체적인 행동 지침과 이유를 적으세요."
  ],
  "tips": "<strong>에디터의 특급 꿀팁!</strong><br>추가로 알면 좋은 노하우나 주의사항 (200자 이상)",
  "conclusion": "전체 과정을 요약하는 1~2문장 마무리",
  "recommendation": {
    "name": "이 문제를 해결하는 데 도움이 되는 추천 상품명 (예: 과탄산소다 1kg, 곰팡이 제거젤)",
    "price": "예상 가격 (예: 12,000원 대)"
  }
}
\`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // 마크다운 제거 처리
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error(`[AI 생성 에러 - 키워드: ${keyword}]`, error);
    return null;
  }
}

async function startAutoGeneration() {
  console.log(`🤖 AI 꿀팁 무한 생성기 가동 (오늘의 키워드 뽑기 완료)`);
  
  const keywords = getRandomKeywords(POSTS_TO_GENERATE);
  const drafts = [];

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    console.log(`[${i+1}/${POSTS_TO_GENERATE}] AI가 포스트를 작성 중입니다... (주제: ${keyword})`);
    
    const structuredData = await generateStructuredContent(keyword);

    if (structuredData) {
      // 카테고리별 무료 고화질 스톡 이미지 호스팅 URL 자동 할당 (LoremFlickr)
      const categoryKeywordMap = {
        'clean': 'cleaning,house',
        'laundry': 'laundry,washing',
        'cook': 'cooking,kitchen,food',
        'organize': 'organization,minimalist,box',
        'maintenance': 'repair,tools,home',
        'hygiene': 'hygiene,health,bathroom',
        'efficiency': 'clock,routine,money',
        'troubleshoot': 'problem,fix,care',
        'lifehack': 'tip,idea,creative'
      };
      
      const searchKeyword = categoryKeywordMap[structuredData.categoryId] || 'home,tips';
      // 브라우저 캐시 방지를 위해 고유 lock 번호 부여
      const autoThumbnail = `https://loremflickr.com/800/600/${searchKeyword}?lock=${Date.now() + i}`;

      drafts.push({
        id: `draft-${Date.now()}-${i}`,
        title: structuredData.title,
        summary: structuredData.summary,
        categoryId: structuredData.categoryId,
        subcategory: structuredData.subcategory,
        tags: `${keyword.replace(/\s+/g, ', ')}, 생활노하우`,
        thumbnailUrl: autoThumbnail,
        content: {
          problem: structuredData.problem,
          cause: structuredData.cause,
          solution: structuredData.solution,
          tips: structuredData.tips,
          conclusion: structuredData.conclusion,
          recommendation: {
            name: structuredData.recommendation?.name || "추천 상품을 입력하세요",
            url: "", // 사용자가 직접 링크를 붙여넣을 자리
            price: structuredData.recommendation?.price || "0원"
          }
        }
      });
    }

    // Rate Limiting 방지 (3초 대기)
    await new Promise(r => setTimeout(r, 3000));
  }

  if (drafts.length > 0) {
    const outputPath = path.resolve('public/drafts.json');
    fs.writeFileSync(outputPath, JSON.stringify(drafts, null, 2), 'utf-8');
    console.log(`\n🎉 완료! ${drafts.length}건의 초고퀄리티 AI 포스트가 public/drafts.json 에 저장되었습니다.`);
  } else {
    console.log(`\n⚠️ AI 호출이 실패했습니다. 구글 API 키 한도나 네트워크를 확인해주세요.`);
  }
}

startAutoGeneration();
