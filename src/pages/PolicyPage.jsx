import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PolicyPage() {
  const { type } = useParams();

  const policies = {
    about: {
      title: "회사 소개 (About Us)",
      content: (
        <div className="space-y-4">
          <p><strong>LifeHub</strong>에 오신 것을 환영합니다!</p>
          <p>저희는 바쁜 현대인들의 삶을 윤택하게 만들어 줄 실용적이고 검증된 생활 꿀팁, 청소 노하우, 요리 레시피 등을 제공하는 라이프스타일 매거진입니다.</p>
          <p>수많은 정보의 홍수 속에서 '진짜 쓸모 있는 정보'만 큐레이션하여 여러분의 시간을 아껴드리고 일상의 질을 높여드리는 것이 저희의 미션입니다.</p>
          <p>항상 독자 여러분의 피드백에 귀 기울이며 더 나은 콘텐츠를 제공하기 위해 노력하겠습니다.</p>
        </div>
      )
    },
    contact: {
      title: "문의하기 (Contact Us)",
      content: (
        <div className="space-y-4">
          <p>LifeHub 서비스 이용 중 궁금한 점이나 제안할 사항이 있으신가요?</p>
          <p>아래 이메일로 연락 주시면 빠르게 확인 후 답변해 드리겠습니다.</p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-6">
            <p className="font-bold text-slate-800">이메일 문의: <a href="mailto:support@lifestyle-hub.co.kr" className="text-blue-600 hover:underline">support@lifestyle-hub.co.kr</a></p>
            <p className="text-sm text-slate-500 mt-2">운영 시간: 평일 10:00 ~ 18:00 (주말 및 공휴일 휴무)</p>
          </div>
        </div>
      )
    },
    privacy: {
      title: "개인정보처리방침 (Privacy Policy)",
      content: (
        <div className="space-y-6">
          <p>LifeHub(이하 '회사')는 이용자의 개인정보를 중요시하며, 개인정보보호법 등 관련 법령을 준수하고 있습니다.</p>
          
          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">1. 수집하는 개인정보 항목</h3>
          <p>회사는 서비스 제공을 위해 아래와 같은 개인정보를 수집할 수 있습니다.<br/>- 자동 수집 항목: IP 주소, 쿠키, 서비스 이용 기록, 기기 정보</p>
          
          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">2. 개인정보의 수집 및 이용 목적</h3>
          <p>수집된 개인정보는 다음의 목적을 위해 활용됩니다.<br/>- 서비스 제공에 관한 계약 이행 및 맞춤형 서비스 제공<br/>- 신규 서비스 개발 및 통계학적 특성에 따른 맞춤형 광고 제공 (구글 애드센스 등)</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">3. 쿠키(Cookie) 및 타사 트래커 사용</h3>
          <p>본 사이트는 구글 애널리틱스 및 구글 애드센스와 같은 제3자 도구를 사용하며, 이 과정에서 사용자의 관심사 기반 광고를 위해 쿠키를 수집할 수 있습니다. 사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>

          <p className="text-sm text-slate-500 mt-8">시행일자: 2024년 1월 1일</p>
        </div>
      )
    },
    terms: {
      title: "이용약관 (Terms of Service)",
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">제1조 (목적)</h3>
          <p>본 약관은 LifeHub(이하 '회사')가 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 회사 간의 권리와 의무를 규정함을 목적으로 합니다.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">제2조 (면책 조항)</h3>
          <p>1. 회사가 제공하는 정보는 참고용이며, 해당 정보의 정확성이나 완벽성을 보증하지 않습니다.<br/>
          2. 사용자가 본 사이트의 정보를 활용하여 발생한 문제에 대해 회사는 법적 책임을 지지 않습니다.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">제3조 (저작권)</h3>
          <p>본 사이트에 게시된 모든 콘텐츠(글, 이미지 등)의 저작권은 회사에 있으며, 무단 복제 및 배포를 엄격히 금지합니다.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">제4조 (제휴 마케팅 공지)</h3>
          <p>본 사이트의 일부 링크는 쿠팡 파트너스 등 제휴 마케팅 링크가 포함되어 있을 수 있으며, 이를 통해 일정액의 수수료를 제공받을 수 있습니다. 이는 구매자의 구매 가격에 어떠한 영향도 미치지 않습니다.</p>
        </div>
      )
    }
  };

  const currentPolicy = policies[type] || policies['about'];

  return (
    <div className="bg-slate-50 min-h-[70vh] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 mb-8 pb-6 border-b border-slate-100">
          {currentPolicy.title}
        </h1>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
          {currentPolicy.content}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-100">
          <Link to="/" className="text-indigo-600 font-bold hover:underline">← 홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}
