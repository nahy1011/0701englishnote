import React, { useState, useEffect } from 'react';
import { fetchWordsByTopic } from '../services/aiService';
import { auth, db, loginWithGoogle, logout } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Footer from './Footer';
import Modal from './Modal';
import TermsContent from './policies/TermsContent';
import PrivacyContent from './policies/PrivacyContent';

function Dashboard({ selectedWords, onToggleWord, onStartBlackboard }) {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('elem3-4');
  const [loading, setLoading] = useState(false);
  const [wordData, setWordData] = useState(null);
  
  const [user, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    // Fetch AI data
    const data = await fetchWordsByTopic(topic, grade);
    setWordData(data);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load saved words
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.selectedWords) {
            // Replace selectedWords if needed (In a real app, you might want a set/add mechanism)
            // But here we rely on the parent component's state. 
            // For simplicity, we just log it or we need a prop to set selected words from parent.
            console.log("Loaded saved words:", data.selectedWords);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSaveToFirestore = async () => {
    if (!user) {
      alert('저장하려면 먼저 로그인해 주세요!');
      return;
    }
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        selectedWords: selectedWords,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      alert('단어장이 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('Error saving to Firestore:', error);
      alert('저장에 실패했습니다.');
    }
    setIsSaving(false);
  };

  const isSelected = (word) => selectedWords.some(w => w.word === word);

  return (
    <>
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Hannah's Word Canvas</h1>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>{user.displayName} 선생님</span>
              <button className="btn" onClick={logout} style={{ padding: '0.5rem 1rem' }}>로그아웃</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={loginWithGoogle} style={{ padding: '0.5rem 1rem' }}>
              Google 로그인
            </button>
          )}
        </div>
      </header>
      
      <main className="main-content">
        <div style={{ background: '#e0f2fe', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', color: '#0369a1', lineHeight: '1.6' }}>
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>💡</span> Hannah's Word Canvas 100% 활용 가이드
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>1. AI 맞춤 단어 추천:</strong> 수업 주제와 학년을 입력하면 AI가 수준별(하/중/상) 핵심 단어를 즉시 뽑아줍니다.</li>
            <li><strong>2. 칠판 띄우기:</strong> 원하는 단어를 체크하고 <strong>'전자칠판 모드 시작'</strong>을 누르면, 실제 4선 영어 공책 화면으로 변신합니다! (원어민 발음 듣기, 뜻 가리기 지원)</li>
            <li><strong>3. 나만의 단어장:</strong> 우측 상단의 <strong>Google 로그인</strong> 후 단어장을 저장해두면, 언제든 다시 꺼내서 수업에 활용할 수 있습니다.</li>
          </ul>
        </div>

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
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn" 
            style={{padding: '1rem 2rem', fontSize: '1.125rem', background: '#fff', border: '1px solid #cbd5e1'}}
            onClick={handleSaveToFirestore}
            disabled={isSaving || selectedWords.length === 0}
          >
            {isSaving ? '저장 중...' : '💾 내 단어장 저장'}
          </button>
          <button 
            className="btn btn-primary" 
            style={{padding: '1rem 2rem', fontSize: '1.125rem'}}
            onClick={onStartBlackboard}
          >
            전자칠판 모드 시작
          </button>
        </div>
      </div>

      <Footer 
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      <Modal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} title="이용약관">
        <TermsContent />
      </Modal>

      <Modal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} title="개인정보처리방침">
        <PrivacyContent />
      </Modal>
    </>
  );
}

export default Dashboard;
