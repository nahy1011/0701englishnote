import React from 'react';

function Footer({ onOpenTerms, onOpenPrivacy }) {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a className="footer-link" onClick={onOpenTerms}>이용약관</a>
        <a className="footer-link" onClick={onOpenPrivacy}>개인정보처리방침</a>
      </div>
      <div className="footer-info">
        정보관리책임자: 양전초등학교 나혜윤
      </div>
      <div className="footer-info">
        &copy; 2026 Hannah's Word Canvas. All rights reserved.
      </div>
      <div className="footer-info" style={{ marginTop: '0.5rem', fontSize: '0.9em', color: '#94a3b8' }}>
        제작자 : 양전초등학교 교사 나혜윤
      </div>
    </footer>
  );
}

export default Footer;
