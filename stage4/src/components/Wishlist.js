import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from './context/productContext';
import './Wishlist.css';

const money = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export default function Wishlist() {
  const { wishlist, getProduct, toggleWishlist } = useContext(ProductContext);
  const products = wishlist.map(id => getProduct(id)).filter(Boolean);

  return (
    <div className="wishlist-page">
      <section className="wishlist-hero">
        <div>
          <span className="eyebrow">NEXORA / WISHLIST</span>
          <h1>Things worth<br /><em>remembering.</em></h1>
          <p>Keep the products you are considering close. Your wishlist is saved to the database for your account.</p>
        </div>
        <div className="wishlist-count"><strong>{products.length}</strong><span>saved products</span></div>
      </section>

      {!products.length ? (
        <section className="wishlist-empty">
          <div className="wishlist-empty-mark">♡</div>
          <span className="eyebrow">NOTHING SAVED YET</span>
          <h2>Build your shortlist.</h2>
          <p>Tap the heart on any product you want to compare later.</p>
          <Link className="primary-button" to="/product">Explore products <span>→</span></Link>
        </section>
      ) : (
        <section className="wishlist-grid">
          {products.map(product => (
            <article className="wishlist-card" key={product.id}>
              <Link to={`/productDetails/${product.id}`} className="wishlist-image">
                {Number(product.discount) > 0 && <span className="wishlist-discount">-{product.discount}%</span>}
                <img src={product.img} alt={product.name} onError={e => { e.currentTarget.style.display = 'none'; }} />
                <div className="wishlist-fallback"><span>{product.category}</span><strong>{product.brand || 'NEXORA'}</strong></div>
              </Link>
              <div className="wishlist-info">
                <div className="wishlist-meta"><span>{product.brand || 'Nexora Select'}</span><span>★ {product.rating || '4.8'}</span></div>
                <Link to={`/productDetails/${product.id}`}><h3>{product.name}</h3></Link>
                <p>{product.shortDescription || product.description}</p>
                <div className="wishlist-bottom">
                  <strong>{money(product.price)}</strong>
                  <button onClick={() => toggleWishlist(product.id)} aria-label={`Remove ${product.name} from wishlist`}>♥ Saved</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
