import React, { useState } from 'react';
import './index.css';
import Dashboard from './components/Dashboard';
import BlackboardMode from './components/BlackboardMode';

function App() {
  const [selectedWords, setSelectedWords] = useState([]);
  const [isBlackboardMode, setIsBlackboardMode] = useState(false);

  const handleToggleWord = (wordObj) => {
    setSelectedWords(prev => {
      const exists = prev.find(w => w.word === wordObj.word);
      if (exists) {
        return prev.filter(w => w.word !== wordObj.word);
      } else {
        return [...prev, wordObj];
      }
    });
  };

  const handleStartBlackboard = () => {
    if (selectedWords.length === 0) {
      alert("단어를 하나 이상 선택해주세요.");
      return;
    }
    setIsBlackboardMode(true);
  };

  const handleCloseBlackboard = () => {
    setIsBlackboardMode(false);
  };

  return (
    <div className="app-container">
      {!isBlackboardMode ? (
        <Dashboard 
          selectedWords={selectedWords} 
          onToggleWord={handleToggleWord}
          onStartBlackboard={handleStartBlackboard}
        />
      ) : (
        <BlackboardMode 
          words={selectedWords} 
          onClose={handleCloseBlackboard} 
        />
      )}
    </div>
  );
}

export default App;
