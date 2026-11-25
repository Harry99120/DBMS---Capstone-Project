import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductContext } from './context/productContext';
import { fetchProduct } from '../api/productApi';

const money = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isWishlisted } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchProduct(id)
      .then(data => {
        if (!alive) return;
        setProduct(data);
        setActiveImage(data.img || data.images?.[0] || '');
      })
      .catch(error => console.error('Unable to load product:', error))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  const images = useMemo(() => {
    const all = [product?.img, ...(product?.images || [])].filter(Boolean);
    return [...new Set(all)];
  }, [product]);

  if (loading) {
    return (
      <main className="product-detail-page">
        <div className="detail-loading-card">
          <div className="detail-skeleton detail-skeleton-image" />
          <div className="detail-skeleton-copy">
            <div className="detail-skeleton line-small" />
            <div className="detail-skeleton line-title" />
            <div className="detail-skeleton line" />
            <div className="detail-skeleton line" />
            <div className="detail-skeleton line-short" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-detail-page">
        <div className="detail-empty">
          <span className="eyebrow">NEXORA / PRODUCT</span>
          <h1>Product unavailable.</h1>
          <p>We couldn't retrieve this product from the catalogue API.</p>
          <Link className="detail-back" to="/product">← Back to collection</Link>
        </div>
      </main>
    );
  }

  const price = Number(product.price);
  const discount = Number(product.discount || 0);
  const oldPrice = discount ? Math.round(price / (1 - discount / 100)) : null;
  const stock = Number(product.stock || 0);
  const rating = Number(product.rating || 0).toFixed(1);
  const reviewCount = Number(product.reviewCount || product.reviews?.length || 0);
  const saved = isWishlisted(product.id);

  const add = async () => {
    const ok = await addToCart(product.id);
    if (!ok) {
      window.location.href = '/login';
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main className="product-detail-page">
      <div className="detail-shell">
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/product">Collection</Link>
          <span>/</span>
          <span>{product.category || 'Product'}</span>
          <span>/</span>
          <strong>{product.name}</strong>
        </nav>

        <section className="detail-layout">
          <div className="detail-gallery">
            <div className="detail-gallery-main">
              <span className="detail-badge">
                {product.featured ? 'FEATURED' : 'NEXORA SELECT'}
              </span>
              <span className="detail-source">LIVE API</span>
              <img src={activeImage || product.img} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="detail-thumbs">
                {images.slice(0, 5).map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className={activeImage === image ? 'detail-thumb active' : 'detail-thumb'}
                    onClick={() => setActiveImage(image)}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-copy">
            <div className="detail-topline">
              <span className="eyebrow">{product.brand || 'NEXORA SELECT'} / {product.category || 'TECHNOLOGY'}</span>
              <span className="detail-product-id">#{product.id}</span>
            </div>

            <h1>{product.name}</h1>

            <div className="detail-rating-row">
              <span className="rating-pill">★ {rating}</span>
              <span>{reviewCount ? `${reviewCount} reviews` : 'Customer reviews'}</span>
              <span className="dot">•</span>
              <span>{product.brand || 'NEXORA Select'}</span>
            </div>

            <div className="detail-price-row">
              <strong>{money(price)}</strong>
              {oldPrice && <del>{money(oldPrice)}</del>}
              {discount > 0 && <span className="discount-pill">-{discount}%</span>}
            </div>

            <p className="detail-description">
              {product.description || 'Designed for people who expect more from their everyday technology. Explore the details and choose the product that fits your world.'}
            </p>

            <div className="detail-divider" />

            <div className="detail-status">
              <div className={stock > 0 ? 'status-item in-stock' : 'status-item out-stock'}>
                <span className="status-dot" />
                <div>
                  <small>AVAILABILITY</small>
                  <strong>{stock > 0 ? `${stock} units ready to ship` : 'Currently out of stock'}</strong>
                </div>
              </div>
              <div className="status-item">
                <span className="status-icon">↗</span>
                <div>
                  <small>SMART MATCH</small>
                  <strong>{Math.min(98, Math.round(80 + Number(product.rating || 4) * 3))} / 100</strong>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              <button
                type="button"
                className={saved ? 'detail-wishlist saved' : 'detail-wishlist'}
                onClick={() => toggleWishlist(product.id)}
              >
                <span>{saved ? '♥' : '♡'}</span>{saved ? 'Saved' : 'Save'}
              </button>
              <button type="button" className="detail-add" disabled={!stock} onClick={add}>
                {added ? '✓ Added to cart' : 'Add to cart'}
                <span>→</span>
              </button>
            </div>

            <Link to="/cartItems" className="detail-cart-link">View cart →</Link>

            <div className="detail-trust-grid">
              <div><span>↻</span><strong>Easy returns</strong><small>Simple return policy</small></div>
              <div><span>▣</span><strong>Secure checkout</strong><small>Protected payment flow</small></div>
              <div><span>✓</span><strong>Live catalogue</strong><small>Fetched from REST API</small></div>
            </div>
          </div>
        </section>

        <section className="detail-information">
          <div className="detail-info-heading">
            <span className="eyebrow">PRODUCT INFORMATION</span>
            <h2>Everything you need to know.</h2>
          </div>
          <div className="detail-info-grid">
            <article>
              <span className="info-number">01</span>
              <h3>Product overview</h3>
              <p>{product.shortDescription || product.description || 'A carefully selected product from the NEXORA live catalogue.'}</p>
            </article>
            <article>
              <span className="info-number">02</span>
              <h3>Catalogue data</h3>
              <p>Price, rating, stock, category and product imagery are retrieved dynamically from the connected product REST API.</p>
            </article>
            <article>
              <span className="info-number">03</span>
              <h3>Why NEXORA</h3>
              <p>Compare products, save favourites and add items to your cart without leaving the product experience.</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
