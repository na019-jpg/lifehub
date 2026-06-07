import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API KEY found!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

const mainKeyword = "청년도약계좌 조건";
const subKeywords = "신청방법, 가입 조건, 금리 비교, 혜택, 구비서류";
const relatedKeywords = "청년통장, 적금 추천, 비과세 혜택, 모바일 신청, 하나은행";
const blogPurpose = "1";
const randomPersona = "30대 직장인 육아맘의 친근하고 정보력이 돋보이는 말투 (~했네요, ~더라고요)";
const internalLinks = [{ title: "청년 주택드림 청약통장 전환 및 혜택 정리", url: "/posts/youth-housing-dream" }];
const targetLink = "/m/landing-page";

const mainKeywordEncoded = encodeURIComponent(mainKeyword);
const internalLinksStr = JSON.stringify(internalLinks);

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const prompt = `
# [Role & Objective]
당신은 구글 SEO(AEO) 및 수익형 블로그 마케팅 전문가이자, 구글의 AI 탐지 알고리즘을 완벽히 우회하는 '인간 다운' 글쓰기 마스터입니다. 
입력받은 [키워드 정보], [기존 글 데이터], [글의 목적], [랜덤 페르소나]를 바탕으로, 티스토리 HTML 모드에 바로 붙여넣을 수 있는 '수익 극대화형 완벽 최적화 포스팅 HTML'을 생성하십시오.

# [Input Data]
- 메인 키워드 ({MAIN_KEYWORD}): ${mainKeyword}
- 서브 키워드 ({SUB_KEYWORDS}): ${subKeywords}
- 연관 키워드 ({RELATED_KEYWORDS}): ${relatedKeywords}
- 글의 목적 ({BLOG_PURPOSE}): ${blogPurpose}
- 랜덤 페르소나 ({RANDOM_PERSONA}): ${randomPersona}
- 내부 링크 목록 ({INTERNAL_LINKS}): ${internalLinksStr}

# [Step-by-Step Execution Rules]

### Step 1. 글의 목적 및 페르소나 동기화 (AI Detection Bypass)
- 지정된 {BLOG_PURPOSE} (현재 목적 코드: ${blogPurpose})의 특성에 맞춰 글의 논리 구조를 작성하십시오.
  1. 정보전달: 객관적, 인과관계 명확, 요약 강조
  2. 후기/리뷰: 주관적 만족도, 장단점 균형, 실제 사용감 묘사
  3. 비교/추천: 대조 표(Table) 활용, 타겟별 추천 분기
  4. 노하우/꿀팁: 단계별 가이드(Step), 주의사항, 실전 팁
  5. 문제해결: 증상/문제 원인 분석 -> 명확한 해결책 제시
- {RANDOM_PERSONA} (현재 페르소나 정보: ${randomPersona})의 어조를 100% 반영하여 모든 문장을 구사하십시오.
- 구글 패턴 매칭을 회피하기 위해 단문과 장문을 불규칙하게 섞고(Burstiness), 문장 내에 "사실 저도 처음에는~", "많은 분들이 놓치시는데~" 같은 인간적인 경험담/독백 페르소나 어투를 최소 3회 이상 자연스럽게 녹여내어 AI 탐지를 우회하십시오.

### Step 2. 키워드 및 YMYL 안전장치 작동
- {MAIN_KEYWORD} (${mainKeyword})는 H2/H3 태그 및 본문 상단 100자 이내에 반드시 포함해야 합니다.
- {SUB_KEYWORDS} (${subKeywords})와 {RELATED_KEYWORDS} (${relatedKeywords})는 본문 흐름에 방해되지 않게 문맥적으로 자연스럽게 분산 배치하십시오.
- 금융/건강 등 고단가 카테고리일 경우, 절대 의학적/법적 확언을 피하고 "일반적인 정보 공유 차원이며, 전문가 상담이 필요할 수 있습니다"라는 면책 문구를 정교하게 흐릿하고 자연스러운 톤으로 본문 하단에 녹여 쓰십시오.

### Step 3. 구조적 SEO 및 스키마 삽입
- HTML 최상단에 해당 포스팅 전용 \`<script type="application/ld+json">\` 스크립트를 삽입해야 합니다.
- 본문 내용 중 핵심 질문 2가지를 뽑아 **구글 리치 결과 노출용 FAQ 구조화 데이터(FAQPage Schema)**를 JSON-LD 내에 포함해야 합니다. 하나의 스키마 데이터 구조 안에 Article과 FAQPage가 동시에 정의될 수 있도록 구성해 주십시오. (예: @graph를 사용하거나 복합 구조 활용)

### Step 4. 이미지 최적화 및 구글 검색 링크 매핑
- 본문 중 맥락이 전환되거나 시각 자료가 필요한 위치에 반드시 아래 규격의 HTML 주석과 앵커 태그를 생성하십시오.
- 규격:
  <!-- [이미지 삽입 구간: ${mainKeyword} 관련 시각 자료] -->
  <!-- 권장 alt 태그: {추천 alt 키워드 문구} -->
  <p><a href="https://www.google.com/search?tbm=isch&q=${mainKeywordEncoded}" target="_blank" style="color: #2b6cb0; text-decoration: underline;">👉 글과 관련된 최적의 이미지 구글에서 바로 찾기 (클릭)</a></p>

# [애드센스 광고 삽입 가이드]
- HTML 최상단(JSON-LD 스크립트 바로 아래)에 아래 자동 광고 스크립트를 1회 반드시 삽입하십시오.
  \`\`\`html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4969939875697438" crossorigin="anonymous"></script>
  \`\`\`
- 본문 소제목(H2, H3) 사이나 단락과 단락 사이 등 문맥이 전환되는 시점에 아래 2개의 애드센스 코드를 각각 최소 1회 이상 삽입하십시오.
  (광고 코드 1 - 디스플레이)
  \`\`\`html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4969939875697438" crossorigin="anonymous"></script>
  <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-4969939875697438" data-ad-slot="6601142958" data-ad-format="auto" data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  \`\`\`
  (광고 코드 2 - 인피드)
  \`\`\`html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4969939875697438" crossorigin="anonymous"></script>
  <ins class="adsbygoogle" style="display:block" data-ad-format="fluid" data-ad-layout-key="-hv-h+25-5w+88" data-ad-client="ca-pub-4969939875697438" data-ad-slot="1636074930"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  \`\`\`
- 본문 중/하단에 시선을 확 사로잡는 화려한 CSS 스타일의 버튼형 전면광고 유도 링크를 최소 1개 이상 반드시 삽입하십시오.
  (예: \`<div style="text-align:center; margin: 40px 0;"><a href="${targetLink}" style="display:inline-block; padding:18px 40px; background:#2563eb; color:#fff; font-size:18px; font-weight:bold; border-radius:12px; text-decoration:none; box-shadow:0 4px 6px rgba(0,0,0,0.1);">👉 내 예상 지원금/환급금 1분 만에 조회하기</a></div>\`)

# [내부 링크 삽입 가이드]
- 입력받은 내부 링크 목록 (${internalLinksStr})의 아이템이 존재할 경우, 글 흐름에 맞는 적절한 본문 영역 혹은 단락 사이에 관련 추천 포스팅 제목과 링크(<a> 태그)를 자연스러운 어조로 연결하여 최소 1회 이상 삽입하십시오.
  (예: \`<p>또한, 많은 분들이 참고하시는 <a href="링크" style="color: #2b6cb0; text-decoration: underline;">"제목"</a> 포스팅을 읽어보시면 더욱 구체적인 팁을 얻으실 수 있습니다.</p>\`)

# [Constraint & Quality Check]
- 현재 시점: ${currentYear}년 ${currentMonth}월 (모든 정보는 ${currentYear}년 최신 트렌드를 기준으로 작성하십시오.)
- 타인의 글을 단순히 복사하는 형식을 절대 지양하고, 정보성 가치가 높은 독창적 포스팅을 지향합니다.
- 본문의 길이는 매우 풍부하게(최소 1,500자 이상) 작성되어야 합니다.

위 가이드라인에 따라 완벽하게 구조화된 '티스토리용 HTML 본문'과 전략을 분석해주십시오.
마크다운 코드 블록 없이 순수 JSON 형식으로만 정확히 반환하십시오.

{
  "keywordAnalysis": "해당 키워드의 ${currentYear}년 예상 CPC 수준 및 공략 세부 키워드 제안",
  "aeoStrategy": "AI 검색 엔진(AEO)에 노출되기 위한 해당 글의 핵심 답변 요약 전략",
  "adPlacementGuide": "전면광고 유도 버튼의 효과적인 배치 위치 및 유도 문구 팁",
  "title": "클릭을 유발하는 고단가 최적화 제목",
  "htmlContent": "<h1>제외, <h2>부터 시작하는 티스토리 블로그 본문 HTML 내용 전체. 반드시 최상단에 <script type='application/ld+json'> 형태의 구글 자동 색인 구조화 데이터와 함께 애드센스 자동 광고 스크립트를 포함할 것. 글 중간에 제공된 애드센스 광고 코드 2가지를 적절히 배치할 것. 글 중/하단에 시선을 확 사로잡는 화려한 CSS 스타일의 <a href='${targetLink}'> 형태 전면광고 유도 버튼을 최소 1개 이상 반드시 삽입할 것. 본문 길이는 매우 길게(1500자 이상) 작성할 것."
}
`;

async function run() {
  console.log("Generating post via Gemini API...");
  try {
    const response = await model.generateContent(prompt);
    let text = response.response.text().trim();
    text = text.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
    const result = JSON.parse(text);
    console.log("SUCCESS!");
    console.log("Title:", result.title);
    console.log("Keyword Analysis:", result.keywordAnalysis);
    console.log("AEO Strategy:", result.aeoStrategy);
    console.log("HTML length:", result.htmlContent.length);
    
    // 검증 포인트 확인
    const html = result.htmlContent;
    console.log("\n=== CHECKPOINTS ===");
    console.log("1. JSON-LD Schema exists:", html.includes("application/ld+json"));
    console.log("2. FAQPage schema exists:", html.includes("FAQPage") || html.includes("Question") || html.includes("faq"));
    console.log("3. Main keyword included:", html.includes(mainKeyword));
    console.log("4. Auto Ads Script exists:", html.includes("ca-pub-4969939875697438"));
    
    // 이미지 링크 추출 및 체크
    const imageLinkRegex = /href="https:\/\/www\.google\.com\/search\?tbm=isch&q=[^"]*"/gi;
    const foundImageLinks = html.match(imageLinkRegex) || [];
    console.log("5. Image Mapping tag exists:", foundImageLinks.length > 0);
    if (foundImageLinks.length > 0) {
      console.log("Found Image Links:", foundImageLinks);
    } else {
      // 비슷한 양식 검색
      const anyGoogleImage = html.match(/href="[^"]*google\.com[^"]*"/gi) || [];
      console.log("Any Google Links found:", anyGoogleImage);
    }
    
    console.log("6. Internal link included:", html.includes("/posts/youth-housing-dream"));
    console.log("7. Interstitial ad button exists:", html.includes(targetLink));
    
    // 이미지 주석 태그 체크
    const imageComments = html.match(/<!--\s*\[이미지\s*삽입\s*구간[^>]*-->/gi) || [];
    console.log("8. Image comments exists:", imageComments.length > 0);
    if (imageComments.length > 0) {
      console.log("Found comments:", imageComments);
    }
    
    // 일부 출력
    console.log("\n=== HTML Sample ===");
    console.log(html.substring(0, 1000) + "\n...[truncated]...\n" + html.substring(html.length - 800));
  } catch (error) {
    console.error("FAIL:", error);
  }
}

run();
