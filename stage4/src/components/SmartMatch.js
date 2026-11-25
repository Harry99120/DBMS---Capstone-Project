import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from './context/productContext';
import './SmartMatch.css';

const SmartMatch = () => {
  const { products } = useContext(ProductContext);
  const [budget, setBudget] = useState(100000);
  const [useCase, setUseCase] = useState('Productivity');
  const [priority, setPriority] = useState('Balanced');
  const [matched, setMatched] = useState(false);

  const result = useMemo(() => {
    const weights = {
      Gaming: { performance: 1.25, budget: 0.9 },
      Productivity: { performance: 1.0, budget: 1.1 },
      'Content Creation': { performance: 1.2, budget: 0.95 },
      'Everyday Use': { performance: 0.8, budget: 1.2 },
    }[useCase];
    const priorityBonus = { Performance: 8, Value: 10, Portability: 6, Balanced: 7 }[priority];

    return [...products]
      .map(p => {
        const price = Number(p.price || 0);
        const rating = Number(p.rating || 0);
        const budgetFit = Math.max(0, 100 - Math.abs(price - budget) / Math.max(budget, 1) * 100);
        const performance = Math.min(100, rating * 20 + (Number(p.featured) ? 5 : 0));
        const score = Math.round(Math.max(0, Math.min(100, budgetFit * weights.budget * 0.55 + performance * weights.performance * 0.35 + priorityBonus)));
        return { ...p, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore)[0];
  }, [products, budget, useCase, priority]);

  return (
    <div className="match-page">
      <section className="match-hero">
        <span className="eyebrow">NEXORA / SMART MATCH</span>
        <h1>Stop scrolling.<br /><em>Start choosing.</em></h1>
        <p>Tell Nexora what matters to you. We score the catalogue against your budget, use case and buying priority.</p>
      </section>

      <section className="match-workspace">
        <div className="match-panel">
          <span className="eyebrow">01 / YOUR USE CASE</span>
          <div className="choice-grid">
            {['Gaming', 'Productivity', 'Content Creation', 'Everyday Use'].map(x => (
              <button key={x} className={useCase === x ? 'selected' : ''} onClick={() => { setUseCase(x); setMatched(false); }}>{x}</button>
            ))}
          </div>

          <span className="eyebrow">02 / YOUR BUDGET</span>
          <div className="budget-value">₹{Number(budget).toLocaleString('en-IN')}</div>
          <input className="budget-slider" type="range" min="25000" max="150000" step="5000" value={budget} onChange={e => { setBudget(Number(e.target.value)); setMatched(false); }} />
          <div className="range-labels"><span>₹25K</span><span>₹1.5L</span></div>

          <span className="eyebrow">03 / WHAT MATTERS MOST?</span>
          <div className="priority-row">
            {['Performance', 'Value', 'Portability', 'Balanced'].map(x => (
              <button key={x} className={priority === x ? 'selected' : ''} onClick={() => { setPriority(x); setMatched(false); }}>{x}</button>
            ))}
          </div>

          <button className="match-button" onClick={() => setMatched(true)}>Find my match <span>→</span></button>
        </div>

        <div className="match-result">
          {!matched ? (
            <div className="match-empty"><span>✦</span><h2>Your recommendation<br />appears here.</h2><p>Adjust the preferences, then let the database-driven catalogue do the narrowing.</p></div>
          ) : result ? (
            <div className="result-content">
              <div className="result-top"><span className="eyebrow">NEXORA RECOMMENDS</span><span className="live-dot">● MATCHED</span></div>
              <div className="result-image"><img src={result.img} alt={result.name} /></div>
              <div className="result-copy">
                <span>{result.brand} / {result.category}</span>
                <h2>{result.name}</h2>
                <div className="score"><strong>{result.matchScore}</strong><span>/ 100<br />MATCH SCORE</span></div>
                <div className="score-bars"><div><span>Budget fit</span><b><i style={{width:`${Math.min(100,result.matchScore+2)}%`}} /></b></div><div><span>Performance</span><b><i style={{width:`${Math.min(100,Number(result.rating||4)*20)}%`}} /></b></div><div><span>Availability</span><b><i style={{width:`${result.stock > 0 ? 100 : 0}%`}} /></b></div></div>
                <Link className="primary-button" to={`/productDetails/${result.id}`}>View recommended product <span>→</span></Link>
              </div>
            </div>
          ) : <div className="match-empty"><span>⌁</span><h2>No catalogue match.</h2><p>Add more products to the database and try again.</p></div>}
        </div>
      </section>

      <section className="match-explainer"><span className="eyebrow">HOW IT WORKS</span><div className="explain-grid"><article><strong>01</strong><h3>Read the catalogue</h3><p>Product price, rating, category, stock and featured status come from the Products collection.</p></article><article><strong>02</strong><h3>Score the fit</h3><p>Nexora calculates a transparent recommendation score from the preferences you selected.</p></article><article><strong>03</strong><h3>Make the decision</h3><p>The final recommendation links directly back to the database-backed product detail page.</p></article></div></section>
    </div>
  );
};

export default SmartMatch;
