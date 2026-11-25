import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from './context/productContext';
import './Product.css';

const categories = ['All', 'Laptops', 'Smartphones', 'Audio', 'Wearables', 'Cameras'];

const Product = () => {
  const { products, addToCart, toggleWishlist, isWishlisted } = useContext(ProductContext);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => {
    const result = products.filter(p => {
      const haystack = `${p.name} ${p.brand || ''} ${p.category || ''}`.toLowerCase();
      return haystack.includes(search.toLowerCase()) && (category === 'All' || p.category === category);
    });
    return [...result].sort((a,b) => {
      if (sort === 'price-low') return Number(a.price) - Number(b.price);
      if (sort === 'price-high') return Number(b.price) - Number(a.price);
      if (sort === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [products, search, category, sort]);

  const money = value => `₹${Number(value).toLocaleString('en-IN')}`;

  const add = async product => {
    const ok = await addToCart(product.id);
    if (!ok) { window.location.href = '/login'; return; }
    setNotice(`${product.name} added to your cart`);
    setTimeout(() => setNotice(''), 1800);
  };

  return (
    <div className="catalog-page">
      {notice && <div className="toast">✓ {notice}</div>}
      <section className="catalog-hero">
        <div><span className="eyebrow">NEXORA / COLLECTION</span><h1>Find your next<br /><em>essential.</em></h1><p>Curated technology with transparent specs, live inventory and a smarter way to compare.</p></div>
        <div className="catalog-count"><strong>{products.length}</strong><span>products in catalogue</span></div>
      </section>

      <section className="catalog-controls">
        <div className="search-box"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products, brands or categories..." /></div>
        <div className="category-tabs">{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option><option value="rating">Top rated</option></select>
      </section>

      <section className="product-grid-premium">
        {filtered.map((product, index) => {
          const discount = Number(product.discount || 0);
          const oldPrice = discount ? Math.round(Number(product.price) / (1 - discount / 100)) : null;
          return <article className="premium-product-card" key={product.id}>
            <Link to={`/productDetails/${product.id}`} className="product-visual">
              <span className="product-index">0{index + 1}</span>
              {discount > 0 && <span className="discount-tag">-{discount}%</span>}
              <button className={`wish ${isWishlisted(product.id) ? 'saved' : ''}`} onClick={async e=>{e.preventDefault();e.stopPropagation();await toggleWishlist(product.id);}} aria-label="Toggle wishlist">{isWishlisted(product.id) ? '♥' : '♡'}</button>
              <img src={product.img} alt={product.name} onError={e=>{e.currentTarget.style.display='none'}} />
              <div className="image-fallback"><span>{product.category || 'Product'}</span><strong>{product.brand || 'NEXORA'}</strong></div>
            </Link>
            <div className="premium-product-info">
              <div className="product-meta"><span>{product.brand || 'Nexora Select'}</span><span>★ {product.rating || '4.8'}</span></div>
              <Link to={`/productDetails/${product.id}`}><h3>{product.name}</h3></Link>
              <p>{product.shortDescription || product.description || 'Premium technology designed for everyday performance.'}</p>
              <div className="price-row"><div><strong>{money(product.price)}</strong>{oldPrice && <del>{money(oldPrice)}</del>}</div><span className={Number(product.stock) < 6 ? 'low-stock' : 'stock'}>{Number(product.stock) === 0 ? 'Out of stock' : Number(product.stock) < 6 ? `${product.stock} left` : 'In stock'}</span></div>
              <button className="add-button" disabled={Number(product.stock) === 0} onClick={()=>add(product)}>{Number(product.stock) === 0 ? 'Unavailable' : 'Add to cart'} <span>＋</span></button>
            </div>
          </article>
        })}
      </section>
      {filtered.length === 0 && <div className="empty-state"><div>⌁</div><h3>No products found</h3><p>Try a different search or category.</p></div>}
    </div>
  );
};

export default Product;
