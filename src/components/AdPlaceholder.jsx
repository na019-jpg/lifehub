import React from 'react';

export default function AdPlaceholder({ position }) {
  return (
    <div className="w-full my-6 flex justify-center items-center">
      <div className="bg-slate-200/60 rounded-xl border-2 border-dashed border-slate-300 w-full max-w-[320px] md:max-w-[728px] h-[100px] md:h-[90px] flex items-center justify-center text-slate-400 text-sm font-medium">
        Google AdSense Placeholder
        <br/>
        <span className="text-xs">({position})</span>
      </div>
      {/* 실제 애드센스 적용 시 아래 코드의 주석을 풀고 사용합니다. */}
      {/* <ins className="adsbygoogle"
           style={{display:"block"}}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
           data-ad-slot="XXXXXXXXXX"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
           (adsbygoogle = window.adsbygoogle || []).push({});
      </script> */}
    </div>
  );
}
