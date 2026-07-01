const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const { GoogleGenerativeAI } = require("@google/generative-ai");

// To use this, you need to set the API key in Firebase config:
// firebase functions:config:set gemini.key="YOUR_API_KEY"
// For local testing, you can temporarily hardcode it or use process.env.GEMINI_API_KEY in .env

exports.getVocabulary = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
      }

      const { topic, grade } = req.body;

      if (!topic) {
        return res.status(400).send('Topic is required');
      }

      const apiKey = functions.config().gemini?.key || process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).send('API key not configured');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite", generationConfig: { responseMimeType: "application/json" } });

      const prompt = `
당신은 ${grade} 학생들을 가르치는 영어 교사입니다.
주어진 주제: "${topic}"

이 주제와 관련된 영어 단어를 난이도별(basic, intermediate, advanced)로 각각 정확히 10개씩 추천해주세요.
단어는 초중등 학생 수준에 맞아야 하며, 뜻은 한국어로 제공해야 합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 설명이나 마크다운 백틱은 추가하지 마세요.
{
  "basic": [
    { "word": "apple", "meaning": "사과" }
  ],
  "intermediate": [
    { "word": "environment", "meaning": "환경" }
  ],
  "advanced": [
    { "word": "biodiversity", "meaning": "생물 다양성" }
  ]
}
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const jsonResult = JSON.parse(responseText);

      return res.status(200).json(jsonResult);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return res.status(500).json({ error: 'Failed to fetch vocabulary' });
    }
  });
});
