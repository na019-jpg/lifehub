import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SeoHelmet({ title, description, keywords, schema, imageUrl, url, type = "website" }) {
  const defaultTitle = "오늘 뭐 입지? & 생활의 지혜 - LifeHub";
  const defaultDesc = "외출 전 날씨에 맞는 완벽한 의상 추천부터 세탁, 건강, 육아, 여행 등 일상 생활을 이롭게 하는 매일의 생활 허브입니다.";
  const defaultImage = "https://lifestyle-hub.co.kr/logo.png";
  const defaultUrl = "https://lifestyle-hub.co.kr";
  
  const finalTitle = title ? `${title} | LifeHub` : defaultTitle;
  const finalDesc = description || defaultDesc;
  const finalImage = imageUrl || defaultImage;
  const finalUrl = url || defaultUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph (Kakao, Facebook) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content="LifeHub" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
