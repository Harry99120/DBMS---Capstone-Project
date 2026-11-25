import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
  <section className="not-found">
    <span className="eyebrow">NEXORA / 404</span>
    <div className="not-found-code">404</div>
    <h1>This page wandered off.</h1>
    <p>The route you requested doesn't exist. Let's get you back to the collection.</p>
    <div className="not-found-actions"><Link to="/" className="primary-button">Return home <span>→</span></Link><Link to="/product" className="text-link">Browse products</Link></div>
  </section>
);
export default NotFound;
