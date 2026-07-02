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
    alert("AI 연동에 실패했습니다. Firebase 로컬 에뮬레이터가 실행 중인지 확인하거나 백엔드 설정을 점검해주세요.");
    
    // Fallback data for smooth UI testing if API fails
    return {
      basic: [{ word: 'API Error', meaning: '에러 발생' }],
      intermediate: [{ word: 'Check Console', meaning: '콘솔 확인' }],
      advanced: [{ word: 'Need Config', meaning: '설정 필요' }]
    };
  }
};
