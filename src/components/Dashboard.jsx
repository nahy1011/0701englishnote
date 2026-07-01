import React, { useState } from 'react';
import { fetchWordsByTopic } from '../services/aiService';

function Dashboard({ selectedWords, onToggleWord, onStartBlackboard }) {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('elem3-4');
  const [loading, setLoading] = useState(false);
  const [wordData, setWordData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    // Fetch mock data
    const data = await fetchWordsByTopic(topic, grade);
    setWordData(data);
    setLoading(false);
  };

  const isSelected = (word) => selectedWords.some(w => w.word === word);

  return (
    <>
      <header className="header">
        <h1>Line-Up English</h1>
      </header>
      
      <main className="main-content">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="input-group">
            <label htmlFor="topic">주제 입력 (예: 과일, 환경)</label>
            <input 
              id="topic"
              type="text" 
              className="input-control" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="주제를 입력하세요"
            />
          </div>
          <div className="input-group">
            <label htmlFor="grade">타겟 학년</label>
            <select 
              id="grade"
              className="input-control"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="elem3-4">초등 3-4학년</option>
              <option value="elem5-6">초등 5-6학년</option>
              <option value="mid">중등</option>
            </select>
          </div>
          <div className="input-group" style={{ justifyContent: 'flex-end', flex: '0 0 auto' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'AI 추천 중...' : 'AI 단어 추천'}
            </button>
          </div>
        </form>

        {wordData && (
          <div className="word-columns">
            <div className="column">
              <h2><span>하 (Basic)</span> <span>{wordData.basic.length}</span></h2>
              {wordData.basic.map(w => (
                <div 
                  key={w.word} 
                  className={`word-card ${isSelected(w.word) ? 'selected' : ''}`}
                  onClick={() => onToggleWord(w)}
                >
                  <input type="checkbox" checked={isSelected(w.word)} readOnly style={{marginRight: '1rem'}} />
                  <div className="word-info">
                    <div className="word-en edu-font">{w.word}</div>
                    <div className="word-ko">{w.meaning}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="column">
              <h2><span>중 (Intermediate)</span> <span>{wordData.intermediate.length}</span></h2>
              {wordData.intermediate.map(w => (
                <div 
                  key={w.word} 
                  className={`word-card ${isSelected(w.word) ? 'selected' : ''}`}
                  onClick={() => onToggleWord(w)}
                >
                  <input type="checkbox" checked={isSelected(w.word)} readOnly style={{marginRight: '1rem'}} />
                  <div className="word-info">
                    <div className="word-en edu-font">{w.word}</div>
                    <div className="word-ko">{w.meaning}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="column">
              <h2><span>상 (Advanced)</span> <span>{wordData.advanced.length}</span></h2>
              {wordData.advanced.map(w => (
                <div 
                  key={w.word} 
                  className={`word-card ${isSelected(w.word) ? 'selected' : ''}`}
                  onClick={() => onToggleWord(w)}
                >
                  <input type="checkbox" checked={isSelected(w.word)} readOnly style={{marginRight: '1rem'}} />
                  <div className="word-info">
                    <div className="word-en edu-font">{w.word}</div>
                    <div className="word-ko">{w.meaning}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="quick-bar">
        <div className="selected-tags">
          <span style={{fontWeight: 600, marginRight: '1rem'}}>선택됨 ({selectedWords.length}) :</span>
          {selectedWords.map(w => (
            <span key={w.word} className="tag">{w.word}</span>
          ))}
        </div>
        <button 
          className="btn btn-primary" 
          style={{padding: '1rem 2rem', fontSize: '1.125rem'}}
          onClick={onStartBlackboard}
        >
          전자칠판 모드 시작
        </button>
      </div>
    </>
  );
}

export default Dashboard;
