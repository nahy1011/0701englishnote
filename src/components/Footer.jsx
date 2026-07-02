import React from 'react';

function Footer({ onOpenTerms, onOpenPrivacy }) {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a className="footer-link" onClick={onOpenTerms}>이용약관</a>
        <a className="footer-link" onClick={onOpenPrivacy}>개인정보처리방침</a>
      </div>
      <div className="footer-info">
        정보관리책임자: Admin (admin@lineup-english.com)
      </div>
      <div className="footer-info">
        &copy; 2026 Line-Up English. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
