import dotenv from 'dotenv';
dotenv.config();

const clientId = process.env.NAVER_CLIENT_ID || 'GYWQrl7X9m5Le39N9HiO';
const clientSecret = process.env.NAVER_CLIENT_SECRET || 'N8lFz2MJo9';

const keywords = ["청년도약계좌 조건", "디딤돌 대출 금리", "소상공인 대환대출", "특례보금자리론 신청"];

const today = new Date();
const endDate = today.toISOString().split('T')[0];
// 14일 전
const startDate = new Date(today.setDate(today.getDate() - 14)).toISOString().split('T')[0];

const keywordGroups = keywords.map(kw => ({ groupName: kw, keywords: [kw] }));

async function run() {
  console.log(`Testing Naver Datalab Search API... (Timeframe: 14 days, from ${startDate} to ${endDate})`);
  console.log(`Client ID: ${clientId}`);
  
  try {
    const response = await fetch('https://openapi.naver.com/v1/datalab/search', {
      method: 'POST',
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate,
        endDate,
        timeUnit: 'date',
        keywordGroups
      })
    });

    const data = await response.json();
    if (data.errorCode) {
      console.error("Naver API Returned Error:", data.errorMessage);
    } else {
      console.log("SUCCESS! Received Datalab trends data.");
      console.log("Result items count:", data.results.length);
      data.results.forEach(result => {
        const recentRatio = result.data.slice(-7).reduce((sum, item) => sum + item.ratio, 0) / 7;
        console.log(`- ${result.title}: recent 7-day average ratio = ${recentRatio.toFixed(2)}`);
      });
    }
  } catch (error) {
    console.error("Network / Server Error:", error);
  }
}

run();
