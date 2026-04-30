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

// 8대 카테고리 분야 전반을 다루는 100+ 꿀팁 키워드 풀
const LIFESTYLE_KEYWORDS = [
  // 의생활
  "누런 면티 하얗게 만들기", "니트 보풀 제거 꿀팁", "겨울 패딩 세탁 및 보관법", "옷에 묻은 커피 얼룩 제거", "청바지 물빠짐 방지",
  // 식생활
  "대파 오랫동안 보관하는 법", "냉동 삼겹살 해동 꿀팁", "프라이팬 기름때 완벽 제거", "전자레인지로 밥 데우는 최적의 방법", "스텐 냄비 연마제 제거",
  // 주거
  "화장실 곰팡이 재발 방지", "실리콘 곰팡이 완벽 제거", "창틀 먼지 신문지 청소법", "배수구 냄새 차단법", "집개미 퇴치법",
  // 건강
  "불면증 해결 수면 환경", "스마트폰 거북목 스트레칭", "가정용 구급함 필수 리스트", "환절기 면역력 루틴", "디지털 디톡스 실천법",
  // 경제
  "사회초년생 연말정산 꿀팁", "안 쓰는 구독 서비스 정리", "숨은 카드 포인트 찾기", "청년 주거 지원 혜택", "알뜰 교통카드 활용법",
  // 디지털
  "스마트폰 용량 정리", "PC 속도 느려질 때 해결법", "안전한 비밀번호 관리", "카카오톡 꿀기능 5가지", "피싱 문자 대처법",
  // 여행
  "해외여행 짐싸기 체크리스트", "비행기표 싸게 예매하는 법", "겨울철 자동차 배터리 관리", "여행자 보험 필수 체크", "장거리 운전 피로 회복",
  // 반려
  "강아지 노령기 케어 꿀팁", "고양이 스크래쳐 고르는 법", "초보자용 공기정화 식물", "화초 분갈이 시기와 방법", "반려동물 금기 식물"
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
당신은 트래픽을 유도하고 제휴 마케팅 수익을 창출하는 '수익형 라이프스타일 매거진 에디터'입니다.
다음 키워드에 맞춰서 엄청나게 유익하고 구체적인 블로그 포스트 데이터를 처음부터 끝까지 창작해주세요: "${keyword}"

현재 사이트는 다음 카테고리 트리 구조를 사용합니다 (반드시 이 표에 있는 Main Category 영문 ID와 서브카테고리 한글명 중 딱 1개씩만 골라야 합니다):

1. 의생활 및 의류 관리(clothing) - 세탁 전문 기술, 수선 및 리폼, 의류 보관, 구매 및 스타일링
2. 식생활 및 주방 관리(food) - 식재료 아카이브, 주방 위생, 식비 절약, 조리 도구
3. 주거 및 홈케어(housing) - 청소의 정석, 셀프 집수리, 해충 및 방역, 공간 효율화
4. 건강 및 라이프 케어(health) - 상비약 및 응급처치, 수면 공학, 홈 트레이닝, 멘탈 케어
5. 경제 및 행정(economy) - 정부 혜택 알림, 세금 및 서류, 스마트 금융, 소비 방어
6. 디지털 및 IT 활용(digital) - 기기 관리, 보안 및 개인정보, 생산성 툴, 디지털 에티켓
7. 여행 및 모빌리티(travel) - 스마트 여행, 차량 관리, 대중교통 활용
8. 반려 생활 및 식물(pets) - 반려동물, 플랜테리어

[필수 작성 가이드라인]
1. 분량: 모든 텍스트를 합쳐서 공백 제외 최소 1,200자 이상으로 매우 상세하게 작성하세요. 대충 넘기지 말고 구체적인 수치, 이유, 원리를 꽉 꽉 채워주세요.
2. 문체: AI 느낌이 전혀 나지 않도록 친근하고 호소력 짙은 전문 에디터 구어체를 사용하세요 ("~했어요", "~랍니다", "진짜 신기하죠?"). 
3. 필수 내용: '실제 경험담(내가 겪었던 고충과 해결했을 때의 쾌감)'과 '전문가적 조언(왜 이 방법이 과학적으로 통하는지)'을 본문에 반드시 녹여내세요.
4. 서식: 본문의 가독성을 극대화하기 위해 각 항목의 텍스트 안에 HTML 태그(<br>, <strong>, <h3>)를 자유롭게 섞어서 작성하세요. (단, JSON 구조는 깨뜨리지 말 것)

응답은 구글 검색 1위를 할 수 있도록 풍부하고 가독성 높게 작성해야 하며, 반드시 다음 JSON 형식에 정확히 맞춰서 반환하세요.
**반드시 \`categoryId\`와 위 표에 있는 정확한 \`subcategory\` 문자열을 선택해 응답에 포함시켜야 합니다.**

키워드: "${keyword}"

{
  "title": "클릭을 유도하는 매력적이고 자극적인 15자 내외 제목",
  "summary": "1~2문장의 핵심 요약 (구글 스니펫용)",
  "categoryId": "clothing, food, housing, health, economy, digital, travel, pets 중 가장 적합한 1개 영문 ID",
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
  "faqs": [
    { "q": "사용자가 궁금해할만한 첫 번째 질문", "a": "그에 대한 명확하고 친절한 답변" },
    { "q": "두 번째 질문", "a": "두 번째 답변" },
    { "q": "세 번째 질문", "a": "세 번째 답변" }
  ]
}
`;

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
  console.log(`🤖 AI 라이프스타일 매거진 포스팅 생성기 가동`);
  
  const keywords = getRandomKeywords(POSTS_TO_GENERATE);
  const drafts = [];

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    console.log(`[${i+1}/${POSTS_TO_GENERATE}] AI가 포스트를 작성 중입니다... (주제: ${keyword})`);
    
    const structuredData = await generateStructuredContent(keyword);

    if (structuredData) {
      drafts.push({
        id: `draft-${Date.now()}-${i}`,
        title: structuredData.title,
        summary: structuredData.summary,
        categoryId: structuredData.categoryId,
        subcategory: structuredData.subcategory,
        tags: `${keyword.replace(/\s+/g, ', ')}, 라이프스타일`,
        // thumbnailUrl 삭제됨
        content: {
          problem: structuredData.problem,
          cause: structuredData.cause,
          solution: structuredData.solution,
          tips: structuredData.tips,
          conclusion: structuredData.conclusion,
          faqs: structuredData.faqs,
          recommendation: {
            name: structuredData.recommendation?.name || "추천 상품을 입력하세요",
            url: "", 
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
