// Mock AI Service for simulating the backend response

const mockData = {
  basic: [
    { word: 'apple', meaning: '사과' },
    { word: 'banana', meaning: '바나나' },
    { word: 'cat', meaning: '고양이' },
    { word: 'dog', meaning: '개' },
    { word: 'egg', meaning: '계란' },
    { word: 'fish', meaning: '물고기' },
    { word: 'girl', meaning: '소녀' },
    { word: 'hat', meaning: '모자' },
    { word: 'ice', meaning: '얼음' },
    { word: 'jump', meaning: '점프하다' },
  ],
  intermediate: [
    { word: 'animal', meaning: '동물' },
    { word: 'basket', meaning: '바구니' },
    { word: 'camera', meaning: '카메라' },
    { word: 'danger', meaning: '위험' },
    { word: 'energy', meaning: '에너지' },
    { word: 'family', meaning: '가족' },
    { word: 'garden', meaning: '정원' },
    { word: 'health', meaning: '건강' },
    { word: 'island', meaning: '섬' },
    { word: 'jungle', meaning: '정글' },
  ],
  advanced: [
    { word: 'agriculture', meaning: '농업' },
    { word: 'biodiversity', meaning: '생물 다양성' },
    { word: 'consequence', meaning: '결과' },
    { word: 'differentiate', meaning: '구별하다' },
    { word: 'environment', meaning: '환경' },
    { word: 'fascinating', meaning: '매혹적인' },
    { word: 'generation', meaning: '세대' },
    { word: 'hypothesis', meaning: '가설' },
    { word: 'infrastructure', meaning: '인프라' },
    { word: 'juxtapose', meaning: '병렬하다' },
  ]
};

export const fetchWordsByTopic = async (topic, grade) => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 1500);
  });
};
