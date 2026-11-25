import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCT_API_BASE_URL } from '../api/productApi';
import './SiteFooter.css';

const SiteFooter = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${PRODUCT_API_BASE_URL}/products/1`, { signal: controller.signal })
      .then((response) => setStatus(response.ok ? 'online' : 'offline'))
      .catch(() => setStatus('offline'));
    return () => controller.abort();
  }, []);

  return (
    <footer className="nexora-footer">
      <div className="footer-top">
        <div className="footer-brand-block">
          <Link to="/" className="brand"><span className="brand-mark">N</span><span>NEXORA</span></Link>
          <p>Intelligent commerce, designed differently.</p>
          <div className="system-status">
            <span className={`status-dot ${status}`} />
            <span>Commerce API {status === 'checking' ? 'checking…' : status === 'online' ? 'online' : 'offline'}</span>
          </div>
        </div>
        <div className="footer-links">
          <div><span>SHOP</span><Link to="/product">Products</Link><Link to="/smart-match">Smart Match</Link><Link to="/wishlist">Wishlist</Link></div>
          <div><span>ACCOUNT</span><Link to="/orders">Orders</Link><Link to="/login">Sign in</Link><Link to="/registration">Create account</Link></div>
          <div><span>PROJECT</span><a href="https://github.com" target="_blank" rel="noreferrer">Source structure ↗</a><Link to="/adminProduct">Control center</Link><a href="#top">Back to top ↑</a></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 NEXORA</span><span>Database-driven commerce management system • Academic project</span><span>React • Axios • JSON Server</span></div>
    </footer>
  );
};
export default SiteFooter;
