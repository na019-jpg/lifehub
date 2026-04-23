export const outfitData = [
  { min: 28, max: 50, label: '무더위', desc: '제습기, 쿨매트, 에어컨 필터, 미니 선풍기', details: '햇빛이 강렬하고 습도가 높습니다. 쾌적한 실내를 위한 제습 가전과 쿨박스, 쿨매트가 필수입니다.', icon: '🌞' },
  { min: 23, max: 27, label: '쾌적한 더위', desc: '자외선 차단제, 양산, 캠핑용품, 얇은 이불', details: '햇빛을 가리기 위한 양산과 자외선 차단제가 필요합니다. 야외 활동용 나들이 용품 구매하기 좋습니다.', icon: '😎' },
  { min: 20, max: 22, label: '나들이 날씨', desc: '피크닉 매트, 등산화, 휴대용 텀블러', details: '야외 활동하기 가장 좋은 선선한 날씨입니다. 주말 피크닉 용품이나 등산 용품을 추천합니다.', icon: '🍃' },
  { min: 17, max: 19, label: '조금 쌀쌀함', desc: '따뜻한 침구류, 환절기 보습 케어, 가습기', details: '일교차가 클 수 있습니다. 건조해지는 피부를 위한 보습제와 실내 가습기를 준비하세요.', icon: '🍂' },
  { min: 12, max: 16, label: '쌀쌀함', desc: '가벼운 온수매트, 극세사 이불, 보온병', details: '제법 쌀쌀해진 날씨입니다. 숙면을 돕는 가벼운 난방 기구나 따뜻한 차를 마실 수 있는 보온병을 추천합니다.', icon: '☕' },
  { min: 9, max: 11, label: '추위 시작', desc: '미니 온풍기, 창풍 방지 비닐, 핫팩', details: '바람이 차갑게 느껴집니다. 창문 틈새로 들어오는 바람을 막을 외풍 차단재와 휴대용 핫팩을 준비하세요.', icon: '🧣' },
  { min: 5, max: 8, label: '추움', desc: '전기요, 가열식 가습기, 고보습 크림', details: '겨울 추위가 느껴지는 날입니다. 난방 효율을 높여줄 가열식 가습기와 전기요가 필수적입니다.', icon: '🧤' },
  { min: -20, max: 4, label: '한파', desc: '수도 동파 방지재, 두꺼운 방한용품, 난방텐트', details: '매우 춥습니다. 실내 온도를 지켜줄 난방텐트와 베란다 수도관 동파를 막을 방지재를 챙기세요.', icon: '❄️' },
];

export function getBackgroundGradient(temp) {
  if (temp >= 28) return 'from-orange-400 to-red-500';
  if (temp >= 20) return 'from-amber-300 to-orange-400';
  if (temp >= 12) return 'from-teal-300 to-blue-400';
  if (temp >= 5) return 'from-blue-400 to-indigo-500';
  return 'from-slate-700 to-slate-950 text-white';
}

export function getOutfitForTemp(temp) {
  return outfitData.find(d => temp >= d.min && temp <= d.max) || outfitData[3];
}
