import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

function BlackboardMode({ words, onClose }) {
  const [showLines, setShowLines] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const [viewMode, setViewMode] = useState('scroll'); // 'scroll' or 'slide'
  const [slideIndex, setSlideIndex] = useState(0);

  const pdfContentRef = useRef();

  const handleTTS = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("이 브라우저에서는 TTS 기능을 지원하지 않습니다.");
    }
  };

  const handleExportPDF = () => {
    const element = pdfContentRef.current;
    const opt = {
      margin:       0.5,
      filename:     'line-up-english-worksheet.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const displayedWords = viewMode === 'scroll' 
    ? words 
    : [words[slideIndex]];

  return (
    <div className="blackboard-view">
      <div className="bb-toolbar">
        <div>
          <button className="btn btn-primary" onClick={onClose} style={{background: '#374151', marginRight: '1rem'}}>
            ← 뒤로 가기
          </button>
          <span style={{fontSize: '1.25rem', fontWeight: 600}}>전자칠판 모드</span>
        </div>
        <div className="bb-controls">
          <button className="btn" onClick={() => setViewMode(v => v === 'scroll' ? 'slide' : 'scroll')}>
            {viewMode === 'scroll' ? '슬라이드 모드로 보기' : '스크롤 모드로 보기'}
          </button>
          <button className="btn" onClick={() => setShowLines(!showLines)}>
            {showLines ? '보조선 숨기기' : '보조선 보이기'}
          </button>
          <button className="btn" onClick={() => setShowMeaning(!showMeaning)}>
            {showMeaning ? '뜻 숨기기' : '뜻 보이기'}
          </button>
          <button className="btn btn-primary" onClick={handleExportPDF}>
            학습지 PDF 다운로드
          </button>
        </div>
      </div>

      {/* Screen View (3 words per row via CSS Grid) */}
      <div 
        className={`bb-content ${!showLines ? 'hidden-lines' : 'blackboard-bg'} screen-layout`} 
      >
        {displayedWords.map((w, index) => (
          <div key={`${w.word}-${index}`} className="bb-word-row">
            <span className="bb-text edu-font">{w.word}</span>
            <span className={`bb-meaning ${!showMeaning ? 'hidden-meaning' : ''}`}>
              {w.meaning}
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', marginTop: 'auto', marginBottom: '10px' }} className="no-print">
              <button className="icon-btn" onClick={() => handleTTS(w.word)} title="발음 듣기">🔊</button>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden PDF View (1 word per row) */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '1000px' }}>
        <div 
          ref={pdfContentRef} 
          className="bb-content blackboard-bg pdf-layout" 
          style={{ height: 'auto', background: 'white' }}
        >
          {words.map((w, index) => (
            <div key={`pdf-${w.word}-${index}`} className="bb-word-row">
              <span className="bb-text edu-font">{w.word}</span>
              <span className="bb-meaning">{w.meaning}</span>
            </div>
          ))}
        </div>
      </div>

      {viewMode === 'slide' && (
        <div style={{ padding: '1rem', background: '#f3f4f6', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            className="btn btn-primary" 
            disabled={slideIndex === 0} 
            onClick={() => setSlideIndex(s => s - 1)}
          >
            이전 단어
          </button>
          <span style={{ padding: '0.75rem', fontWeight: 600 }}>
            {slideIndex + 1} / {words.length}
          </span>
          <button 
            className="btn btn-primary" 
            disabled={slideIndex === words.length - 1} 
            onClick={() => setSlideIndex(s => s + 1)}
          >
            다음 단어
          </button>
        </div>
      )}
    </div>
  );
}

export default BlackboardMode;
