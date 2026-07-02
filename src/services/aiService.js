// Vercel deployment uses Vercel Serverless Functions (/api/...)
const CLOUD_FUNCTION_URL = '/api/getVocabulary';

export const fetchWordsByTopic = async (topic, grade) => {
  try {
    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, grade }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch words from AI:", error);
    alert("AI 서버 연동에 실패했습니다. 버셀(Vercel) 환경 변수에 GEMINI_API_KEY가 정확히 설정되었는지 확인해 주세요.");
    
    // Fallback data for smooth UI testing if API fails
    return {
      basic: [{ word: 'API Error', meaning: '에러 발생' }],
      intermediate: [{ word: 'Check Console', meaning: '콘솔 확인' }],
      advanced: [{ word: 'Need Config', meaning: '설정 필요' }]
    };
  }
};
