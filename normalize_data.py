import json
import os

path = 'src/data/content.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Default FAQs
default_faqs = [
    {
        "q": "본문에서 소개된 팁은 누구나 쉽게 따라 할 수 있나요?",
        "a": "네! 에디터가 직접 검증하고 선별한 방법들로, 특별한 전문 지식 없이도 가정에서 누구나 쉽고 안전하게 따라 하실 수 있도록 구성되었습니다."
    },
    {
        "q": "추천된 아이템은 어디서 구매할 수 있나요?",
        "a": "본문 하단에 제공된 '최저가 확인하기' 버튼을 클릭하시면, 실시간 할인율이 적용된 안전한 공식 구매처(쿠팡 등)로 바로 연결됩니다."
    }
]

# Default Recommendation
default_rec = {
    "name": "🔥 홈라이프/리빙 카테고리 로켓배송 BEST 추천템",
    "url": "https://link.coupang.com/a/b0E9X1",
    "price": "역대급 실시간 할인가 적용 중"
}

modified = False
for post in data['posts']:
    content = post.get('content', {})
    
    if 'faqs' not in content or not content['faqs']:
        content['faqs'] = default_faqs
        modified = True
        
    if 'recommendation' not in content or not content['recommendation']:
        content['recommendation'] = default_rec
        modified = True
        
    post['content'] = content

if modified:
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Updated content.json successfully.")
else:
    print("No updates needed.")
