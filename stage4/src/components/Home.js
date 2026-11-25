import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="home-page">
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">INTELLIGENT COMMERCE • 2026</span>
        <h1>Technology that<br /><em>fits your world.</em></h1>
        <p className="hero-text">
          Discover a curated marketplace where powerful products, transparent pricing and smart recommendations meet.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/product">Explore collection <span>→</span></Link>
          <Link className="text-link" to="/registration">Build your account ↗</Link>
        </div>
        <div className="hero-stats">
          <div><strong>100+</strong><span>Curated products</span></div>
          <div><strong>4.8/5</strong><span>Average rating</span></div>
          <div><strong>24/7</strong><span>Digital storefront</span></div>
        </div>
      </div>

      <div className="hero-art">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="floating-card card-main">
          <div className="floating-card-top"><span>FEATURED DROP</span><span>● LIVE</span></div>
          <div className="device-stage"><div className="device-laptop"><div className="device-screen">NEXORA<br /><small>WORK / CREATE / PLAY</small></div></div></div>
          <div className="floating-card-bottom"><span>Premium Tech</span><strong>Explore →</strong></div>
        </div>
        <div className="floating-mini mini-one">⚡<span>Fast checkout</span></div>
        <div className="floating-mini mini-two">✦<span>Smart match</span></div>
      </div>
    </section>

    <section className="marquee-strip"><div>DISCOVER • COMPARE • CHOOSE BETTER • DISCOVER • COMPARE • CHOOSE BETTER • </div></section>

    <section className="home-section">
      <div className="section-heading"><div><span className="eyebrow">WHY NEXORA</span><h2>More than a shopping cart.</h2></div><p>Built as a complete commerce management system — from product discovery to orders, inventory and database operations.</p></div>
      <div className="feature-grid">
        <article className="feature-card dark"><span className="feature-number">01</span><div className="feature-icon">✦</div><h3>Smart Match</h3><p>Compare products through budget, performance and use-case signals instead of endless scrolling.</p></article>
        <article className="feature-card"><span className="feature-number">02</span><div className="feature-icon">◫</div><h3>Live Inventory</h3><p>Product availability is tied to persistent data, so stock and cart behaviour stay synchronized.</p></article>
        <article className="feature-card"><span className="feature-number">03</span><div className="feature-icon">⌁</div><h3>Database First</h3><p>Users, products, carts and orders are represented as connected entities with CRUD operations.</p></article>
      </div>
    </section>

    <section className="home-section dark-section">
      <div className="section-heading light"><div><span className="eyebrow">THE COLLECTION</span><h2>Built for the next move.</h2></div><Link className="text-link light-link" to="/product">View all products →</Link></div>
      <div className="category-grid">
        {['Laptops','Smartphones','Audio','Wearables'].map((item, i) => <Link to="/product" className={`category-tile category-${i}`} key={item}><span>0{i+1}</span><h3>{item}</h3><p>Explore collection →</p></Link>)}
      </div>
    </section>

    <section id="principle" className="home-section manifesto"><span className="eyebrow">THE NEXORA PRINCIPLE</span><h2>Less noise.<br /><em>Better decisions.</em></h2><p>We designed the experience around the way people actually choose technology: understand the options, compare the trade-offs, then buy with confidence.</p><Link className="primary-button" to="/product">Start exploring <span>→</span></Link></section>

    <footer className="site-footer"><div className="brand"><span className="brand-mark">N</span><span>NEXORA</span></div><span>Database-driven commerce management system • Academic project</span><span>© 2026</span></footer>
  </div>
);

export default Home;
