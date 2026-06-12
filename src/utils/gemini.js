import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateTistoryPost({
  mainKeyword,
  subKeywords = '',
  relatedKeywords = '',
  blogPurpose = '1',
  randomPersona = '',
  internalLinks = [],
  targetLink = '/m',
  postType = 'revenue' // 'approval' or 'revenue'
}) {
  if (!genAI) {
    throw new Error('VITE_GEMINI_API_KEY가 설정되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const mainKeywordEncoded = encodeURIComponent(mainKeyword);
  const internalLinksStr = JSON.stringify(internalLinks);

  let prompt = '';

  if (postType === 'approval') {
    prompt = `
# [Role & Objective]
당신은 구글 애드센스(AdSense) 승인 심사를 단 한 번에 통과할 수 있도록 최적화된 전문 학술/정보 블로그 작가이자 구글 AI 탐지 우회 전문가입니다.
입력받은 [키워드 정보], [글의 목적], [랜덤 페르소나]를 바탕으로, 애드센스 승인 기준(정보성 가치 극대화, 정합성, AI 우회)에 완벽히 부합하는 '애드센스 승인용 포스팅 HTML'을 생성하십시오.

# [Input Data]
- 메인 키워드 ({MAIN_KEYWORD}): ${mainKeyword}
- 서브 키워드 ({SUB_KEYWORDS}): ${subKeywords}
- 연관 키워드 ({RELATED_KEYWORDS}): ${relatedKeywords}
- 글의 목적 ({BLOG_PURPOSE}): ${blogPurpose}
- 랜덤 페르소나 ({RANDOM_PERSONA}): ${randomPersona}

# [AdSense Approval Posting Rules (필수 준수 사항)]

1. **글자수 극대화**:
   - 본문의 글자수는 공백을 포함하여 **반드시 2,000자 이상**으로 풍부하고 정보성 높은 긴 텍스트로 채우십시오.
   - 단답식 요약보다는 깊이 있고 체계적인 설명(서론, 본론, 결론 구조)을 완성하십시오.

2. **광고 코드 및 외부 링크 배제**:
   - 아직 승인받지 않은 블로그이므로 **구글 애드센스 스크립트 코드나 광고 삽입용 ins 태그 등을 절대로 넣지 마십시오**.
   - 외부 사이트로 유도하는 하이퍼링크(a 태그)나 선정적인 버튼, 배너 등을 **절대 포함하지 마십시오**. 오직 순수 정보성 글만으로 구성되어야 합니다.

3. **영어 표기 및 영문 괄호 완벽 제거**:
   - 본문 내 모든 영어 표기, 영어 원어명, 괄호 안의 영문 표기(예: "multiverse theory", "Hugh Everett", "Many-Worlds" 등)를 **완전히 지우고 오직 순수 한글 단어로만 작성**하십시오.
   - 예: "다중우주론(multiverse theory)" -> "다중우주론"으로 순수하게 작성.

4. **제목(H 태그)의 순서적 논리 구조**:
   - 소제목은 반드시 제목1 -> 제목2 -> 제목3 순으로 중첩되어야 합니다.
   - 본문의 첫 소제목은 **제목 1 (<h2>)**로 하십시오.
   - 그 다음 소제목은 **제목 2 (<h3>)**로 하십시오.
   - 그 이후에 나오는 네 번째 및 모든 소제목들은 전부 **제목 3 (<h4>)**으로만 설정하십시오. (즉, H 태그 구조는 <h2> -> <h3> -> <h4> -> <h4>... 순이어야 하며, <h4> 이하의 태그나 논리 흐름의 단계를 건너뛰지 마십시오.)

5. **첫 부분 일치 규칙 (서론 첫 문장)**:
   - 본문의 서론 첫 번째 문장은 **이 포스팅의 제목(메인 키워드가 들어간 생성될 제목)을 반드시 그대로 토대로 단어를 포함하여 시작**해야 합니다.
   - 예: 제목이 "다중우주론의 무한한 가능성"이라면, 서론 첫 문장은 "다중우주론: 무한한 가능성의 우주를 탐구하기 위해서 오늘은 다중우주론의 개념과 기원 그리고 유형과 가능성 등에 대해 알아보도록 하겠습니다." 처럼 제목 문구가 자연스럽게 포함된 서두로 설계하십시오.

6. **대표 이미지 1장 최적화**:
   - 본문 서론 바로 아래에 **오직 1장의 대표 이미지 영역만 생성**하십시오.
   - 이 이미지의 alt 속성과 캡션(figcaption) 설명글은 **반드시 이 포스팅의 제목과 100% 동일한 글자**로 지정하십시오.
   - 이미지 코드 규격:
     <!-- [대표 이미지 삽입 구간: {제목}] -->
     <!-- 대체 텍스트(alt): {제목} -->
     <figure style="text-align: center; margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px;">
       <div style="background: #f8fafc; padding: 40px; border-radius: 8px; color: #64748b; font-weight: bold;">
         📷 {제목} - 대표 이미지
       </div>
       <figcaption style="font-size: 13px; color: #64748b; margin-top: 8px; font-weight: 500;">{제목}</figcaption>
     </figure>

7. **인간적인 톤앤매너 및 AI 우회**:
   - 정보성 70%, 본인의 주관이나 직접 쓴 듯한 후기/체험성 느낌 30%를 조합하십시오.
   - 문장 중간에 "이게 의외로 놓치기 쉽습니다", "저도 처음에 공부할 때 정말 헷갈렸던 부분인데요" 같은 인간적인 독백/경험형 문장을 3회 이상 삽입하고 문장 길이를 불규칙하게 섞어 구글 AI 탐지 필터를 완벽 우회하십시오.

8. **구조화 데이터**:
   - HTML 최상단에 포스팅을 요약 설명하는 [script type="application/ld+json"] (Article 스키마) 데이터 구조만 삽입하십시오. (여기에 광고 코드는 절대 포함하지 마십시오.)

# [Output Format]
마크다운 코드 블록 없이 순수 JSON 형식으로만 정확히 반환하십시오.

{
  "keywordAnalysis": "해당 키워드의 정보성 가치 및 구글 SEO 노출 예상 분석",
  "aeoStrategy": "구글 검색 엔진 및 AEO 노출을 위해 서두 정합성과 H 태그 구조가 어떻게 매칭되었는지 설명",
  "adPlacementGuide": "애드센스 승인 완료 직후 적용하기에 최적인 광고 배치 자리 및 유도 위치 추천 (현재 본문엔 광고 없음)",
  "title": "클릭을 유발하면서 정보성이 돋보이는 애드센스 승인용 포스팅 제목",
  "htmlContent": "<h1>제외, <h2>부터 시작하는 티스토리 블로그 본문 HTML 내용 전체. 반드시 최상단에 script type='application/ld+json' 형태의 구글 자동 색인 구조화 데이터 포함. 순수 한글 중심, 광고 코드 배제, 대표 이미지 1장만 배치하고 alt/figcaption은 글의 제목과 100% 똑같이 설정할 것. 본문 길이는 2000자 이상으로 텍스트를 아주 길게 채울 것.",
  "hashtags": "메인키워드,서브키워드1,서브키워드2,서브키워드3,서브키워드4,서브키워드5,연관키워드1,연관키워드2,연관키워드3,연관키워드4,연관키워드5"
}
`;
  } else {
    prompt = `
# [Role & Objective]
당신은 구글 SEO(AEO) 및 수익형 블로그 마케팅 전문가이자, 구글의 AI 탐지 알고리즘을 완벽히 우회하고 방문자의 광고 클릭률(CTR)을 극대화하는 카피라이팅 전문가입니다. 
입력받은 [키워드 정보], [기존 글 데이터], [글의 목적], [랜덤 페르소나]를 바탕으로, 티스토리 HTML 모드에 바로 붙여넣어 수익을 최대로 끌어낼 수 있는 '수익형 포스팅 HTML'을 생성하십시오.

# [Input Data]
- 메인 키워드 ({MAIN_KEYWORD}): ${mainKeyword}
- 서브 키워드 ({SUB_KEYWORDS}): ${subKeywords}
- 연관 키워드 ({RELATED_KEYWORDS}): ${relatedKeywords}
- 글의 목적 ({BLOG_PURPOSE}): ${blogPurpose}
- 랜덤 페르소나 ({RANDOM_PERSONA}): ${randomPersona}
- 내부 링크 목록 ({INTERNAL_LINKS}): ${internalLinksStr}

# [Revenue Posting Rules (필수 준수 사항)]

1. **소제목 및 수동광고 코드 강제 삽입**:
   - 수익형 포스팅의 본문에는 총 2회의 수동 애드센스 광고 코드를 본문 내에 정확히 포함해야 합니다.
   - **첫 번째 수동광고**: 본문 첫 번째 **제목 1 (<h2>)** 소제목과, 그 바로 아래 나오는 **한 줄의 첫 문장 설명**이 끝나는 시점에 아래의 [디스플레이 광고 코드]를 삽입하십시오.
   - **두 번째 수동광고**: 본문 두 번째 **제목 2 (<h3>)** 소제목과, 그 바로 아래 나오는 **한 줄의 첫 문장 설명**이 끝나는 시점에 아래의 [인피드 광고 코드]를 삽입하십시오.

2. **클릭 유도 요소 및 전면광고 극대화 (새창 열기 금지)**:
   - 본문 중/하단에 시선을 끄는 화려한 CSS 스타일의 버튼형 전면광고 유도 링크를 최소 1개 이상 반드시 삽입하십시오.
   - **중요**: 전면광고(Interstitial Ads)의 노출 빈도를 높이기 위해, 본문의 모든 전면광고 유도 버튼 링크(a href="${targetLink}")와 본문 내 클릭 유도 이미지 링크에는 **절대로 target="_blank" (새창에서 열기)를 넣지 마십시오!** 반드시 현재 창(target="_self" 또는 target 속성 제외)에서 열리도록 작성하십시오.
   - 버튼 예시:
     <div style="text-align:center; margin: 30px 0;">
       <a href="${targetLink}" style="display:inline-block; padding:18px 45px; background:linear-gradient(135deg, #2563eb, #1d4ed8); color:#fff; font-size:18px; font-weight:bold; border-radius:12px; text-decoration:none; box-shadow:0 10px 15px -3px rgba(37,99,235,0.3); transition:all 0.2s;">👉 ${mainKeyword} 관련 조회 및 신청 바로가기 👆</a>
     </div>

3. **다수 이미지 배치 전략 (상위 노출용)**:
   - 상위 노출에 유리하도록 본문에 여러 장의 시각 자료 구간을 분산 생성하십시오.
   - **메인 정보성 이미지**: 본문 상단(H2 아래)에 공식 사이트 캡처 이미지 구간을 1개 만드십시오.
   - **3장 가로 나열 이미지**: 본문 하단(H3 아래)에 상위 노출 개수를 채우기 위한 3장의 이미지 구간을 만드십시오.
   - 이미지 코드 예시:
     <!-- [대표 정보성 이미지: ${mainKeyword} 관련 모의계산/공식화면] -->
     <!-- [상위노출 보조 이미지 3장 가로 나열 구간] -->

4. **첨부파일 서식 영역 제공**:
   - 포스팅의 신뢰도와 클릭률을 높이기 위해, 본문 하단부에 아래 예시 형태의 다운로드 가능한 관련 첨부파일(신청 서식 등) 디자인 박스 영역을 삽입하십시오.
   - 첨부파일 코드 예시:
     <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin: 25px 0; background-color: #f8fafc; display: flex; align-items: center; justify-content: space-between;">
       <div>
         <span style="font-weight: bold; color: #334155; font-size: 14px;">📄 ${mainKeyword} 신청 서식 및 안내 자료.hwp</span>
         <span style="color: #64748b; font-size: 11px; display: block; margin-top: 3px;">용량: 0.12MB / 양식 문서</span>
       </div>
       <a href="${targetLink}" style="background-color: #475569; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: bold;">다운로드</a>
     </div>

5. **키워드 자동 분산 배치 및 YMYL 면책 문구**:
   - {MAIN_KEYWORD} (${mainKeyword})는 본문 상단 100자 이내에 꼭 포함되게 하십시오.
   - 전달된 서브 키워드나 연관 키워드가 부족할 경우, 스스로 고단가/고유입 최적 키워드 5개씩 선정하여 문맥 속에 고르게 배치하고, 반환 JSON의 'keywordAnalysis' 첫 부분에 이를 적어 주십시오.
   - 해시태그는 공백 없이 쉼표로만 구분된 11개(메인1 + 서브5 + 연관5)의 키워드 목록을 만드십시오.
   - 본문 최하단에 작고 흐릿한 톤으로 "본 정보는 참고용이며 상세 내용은 공식 문의를 통해 확인하십시오" 형태의 정교한 YMYL 면책 문구를 추가하십시오.

6. **구조화 데이터 및 스키마**:
   - 최상단에 FAQPage와 Article이 결합된 [script type="application/ld+json"] 구조화 데이터를 넣어 구글 리치 스니펫 검색 노출을 극대화하십시오.

# [광고 코드 리소스]
- (자동 광고 스크립트 - 최상단용)
  &lt;script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4969939875697438" crossorigin="anonymous"&gt;&lt;/script&gt;
- (디스플레이형 광고 코드 - H2 직후 본문 첫 문장 아래 배치용)
  &lt;script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4969939875697438" crossorigin="anonymous"&gt;&lt;/script&gt;
  &lt;ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-4969939875697438" data-ad-slot="6601142958" data-ad-format="auto" data-full-width-responsive="true"&gt;&lt;/ins&gt;
  &lt;script&gt;(adsbygoogle = window.adsbygoogle || []).push({});&lt;/script&gt;
- (인피드형 광고 코드 - H3 직후 본문 첫 문장 아래 배치용)
  &lt;script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4969939875697438" crossorigin="anonymous"&gt;&lt;/script&gt;
  &lt;ins class="adsbygoogle" style="display:block" data-ad-format="fluid" data-ad-layout-key="-hv-h+25-5w+88" data-ad-client="ca-pub-4969939875697438" data-ad-slot="1636074930"&gt;&lt;/ins&gt;
  &lt;script&gt;(adsbygoogle = window.adsbygoogle || []).push({});&lt;/script&gt;

# [Output Format]
마크다운 코드 블록 없이 순수 JSON 형식으로만 정확히 반환하십시오.

{
  "keywordAnalysis": "이번 포스팅에 자동으로 적용된 서브 키워드: [선정된 5개], 연관 키워드: [선정된 5개] - 예상 CPC 수준 분석",
  "aeoStrategy": "AI 검색 엔진(AEO)에 노출되기 위한 해당 글의 핵심 답변 요약 전략",
  "adPlacementGuide": "수동광고와 전면광고 유도 버튼이 배치된 곳의 효과적인 CTR 분석",
  "title": "클릭을 유발하는 고단가 최적화 제목",
  "htmlContent": "<h1>제외, <h2>부터 시작하는 티스토리 블로그 본문 HTML 내용 전체. 반드시 최상단에 구조화 데이터 스크립트와 애드센스 자동 광고 스크립트 포함. H2 직후 첫 문장 다음 수동광고1, H3 직후 첫 문장 다음 수동광고2를 반드시 배치. 본문 하단에 target='_blank'가 배제된 전면광고 유도 버튼과 첨부파일 서식 디자인 박스를 꼭 배치하고 본문 길이는 1500자 이상으로 매우 상세히 쓸 것.",
  "hashtags": "메인키워드,서브키워드1,서브키워드2,서브키워드3,서브키워드4,서브키워드5,연관키워드1,연관키워드2,연관키워드3,연관키워드4,연관키워드5"
}
`;
  }

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Tistory AI Generation Error:', error);
    throw error;
  }
}

export async function recommendImageAndLink(keyword) {
  if (!genAI) {
    throw new Error('VITE_GEMINI_API_KEY가 설정되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `
당신은 구글 애드센스 및 제휴 마케팅 전문가입니다.
사용자가 티스토리 블로그에 포스팅할 키워드(주제)를 주면, 해당 포스팅에서 수익을 극대화하기 위해 어떤 "이미지"를 삽입하고 어떤 "전면광고 유도 버튼 링크(제휴 링크 등)"를 연결하면 좋을지 3-4문장으로 짧고 명확하게 추천해주세요.

사용자 키워드: "${keyword}"

답변 형식 예시:
- 추천 이미지: 지원금 지급액 표, 건강보험료 모의계산 화면 캡처 등 독자의 시선을 끄는 정보성 이미지
- 추천 링크: 정부24 지원금 조회 페이지, 또는 쿠팡 파트너스 건강영양제 기획전 링크를 연결하여 직접적인 행동을 유도하세요.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Recommendation Error:', error);
    throw error;
  }
}
