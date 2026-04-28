import React, { useEffect } from 'react';

export default function AdPlaceholder({ position }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense execution error:", e);
    }
  }, []);

  return (
    <div className="w-full my-6 flex flex-col justify-center items-center overflow-hidden">
      {/* 실제 환경용 AdSense (슬롯 교체 필요) */}
      <ins className="adsbygoogle"
           style={{display: "block", textAlign: "center", minWidth: "300px", width: "100%", height: "auto"}}
           data-ad-layout="in-article"
           data-ad-format="fluid"
           data-ad-client="ca-pub-4969939875697438"
           data-ad-slot="8301925796"></ins>
           
      {/* 개발 환경 시각적 도움을 위한 플레이스홀더 (개발 시만 필요) */}
      <div className="bg-slate-100 rounded-xl border border-slate-200 w-full max-w-[728px] py-4 mt-2 flex items-center justify-center text-slate-400 text-xs text-center border-dashed">
        Google AdSense Slot <br/>({position})
      </div>
    </div>
  );
}
