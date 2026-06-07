export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { keywords } = req.body;
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid keywords array' });
    }

    const clientId = process.env.NAVER_CLIENT_ID || 'GYWQrl7X9m5Le39N9HiO';
    const clientSecret = process.env.NAVER_CLIENT_SECRET || 'N8lFz2MJo9';

    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    const startDate = new Date(today.setDate(today.getDate() - 14)).toISOString().split('T')[0];

    const results = [];
    const baseline = keywords[0];
    const chunks = [];
    
    for (let i = 1; i < keywords.length; i += 4) {
      chunks.push(keywords.slice(i, i + 4));
    }
    if (keywords.length === 1) chunks.push([]);

    let baselineMaxRatio = 100;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const keywordGroups = [
        { groupName: baseline, keywords: [baseline] },
        ...chunk.map(kw => ({ groupName: kw, keywords: [kw] }))
      ];

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
        throw new Error(data.errorMessage);
      }

      const baselineData = data.results.find(r => r.title === baseline);
      const recentBaselineRatio = baselineData.data.slice(-7).reduce((sum, item) => sum + item.ratio, 0) / 7;

      let normalizationFactor = 1;
      if (i === 0) {
        baselineMaxRatio = recentBaselineRatio;
      } else {
        normalizationFactor = baselineMaxRatio / (recentBaselineRatio || 1);
      }

      data.results.forEach(result => {
        if (i > 0 && result.title === baseline) return;
        const recentRatio = result.data.slice(-7).reduce((sum, item) => sum + item.ratio, 0) / 7;
        const normalizedRatio = recentRatio * normalizationFactor;
        results.push({ keyword: result.title, score: normalizedRatio });
      });
    }

    results.sort((a, b) => b.score - a.score);
    return res.status(200).json({ trends: results.map(r => r.keyword) });

  } catch (error) {
    console.error('Naver API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
