import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SeoHelmet({ title, description, keywords }) {
  const defaultTitle = "오늘 뭐 입지? & 생활의 지혜 - LifeHub";
  const defaultDesc = "외출 전 날씨에 맞는 완벽한 의상 추천부터 세탁, 건강, 육아, 여행 등 일상 생활을 이롭게 하는 매일의 생활 허브입니다.";
  
  return (
    <Helmet>
      <title>{title ? `${title} | LifeHub` : defaultTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={title ? `${title} | LifeHub` : defaultTitle} />
      <meta property="og:description" content={description || defaultDesc} />
    </Helmet>
  );
}
