import fs from 'fs';
import path from 'path';

const contentPath = path.resolve('./src/data/content.json');
const data = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// 1. 새 8대 카테고리 정의
data.categories = [
  {
    "id": "clothing",
    "name": "의생활 및 의류 관리",
    "icon": "👕",
    "subcategories": ["세탁 전문 기술", "수선 및 리폼", "의류 보관", "구매 및 스타일링"]
  },
  {
    "id": "food",
    "name": "식생활 및 주방 관리",
    "icon": "🍳",
    "subcategories": ["식재료 아카이브", "주방 위생", "식비 절약", "조리 도구"]
  },
  {
    "id": "housing",
    "name": "주거 및 홈케어",
    "icon": "🏠",
    "subcategories": ["청소의 정석", "셀프 집수리", "해충 및 방역", "공간 효율화"]
  },
  {
    "id": "health",
    "name": "건강 및 라이프 케어",
    "icon": "💊",
    "subcategories": ["상비약 및 응급처치", "수면 공학", "홈 트레이닝", "멘탈 케어"]
  },
  {
    "id": "economy",
    "name": "경제 및 행정",
    "icon": "💰",
    "subcategories": ["정부 혜택 알림", "세금 및 서류", "스마트 금융", "소비 방어"]
  },
  {
    "id": "digital",
    "name": "디지털 및 IT 활용",
    "icon": "💻",
    "subcategories": ["기기 관리", "보안 및 개인정보", "생산성 툴", "디지털 에티켓"]
  },
  {
    "id": "travel",
    "name": "여행 및 모빌리티",
    "icon": "✈️",
    "subcategories": ["스마트 여행", "차량 관리", "대중교통 활용"]
  },
  {
    "id": "pets",
    "name": "반려 생활 및 식물",
    "icon": "🐾",
    "subcategories": ["반려동물", "플랜테리어"]
  }
];

// 2. 카테고리 마이그레이션 매핑
const categoryMap = {
  'clean': 'housing',
  'laundry': 'clothing',
  'cook': 'food',
  'organize': 'housing',
  'maintenance': 'housing',
  'hygiene': 'health',
  'efficiency': 'economy',
  'troubleshoot': 'housing',
  'lifehack': 'housing',
  'tips': 'housing' // 혹시 남아있을 수 있는 tips 카테고리
};

// 3. 포스트 순회하며 categoryId 변경
data.posts.forEach(post => {
  if (categoryMap[post.categoryId]) {
    post.categoryId = categoryMap[post.categoryId];
  }
  // Remove thumbnailUrl
  if (post.thumbnailUrl) {
    delete post.thumbnailUrl;
  }
});

// 4. 저장
fs.writeFileSync(contentPath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ 카테고리 마이그레이션이 완료되었습니다.');