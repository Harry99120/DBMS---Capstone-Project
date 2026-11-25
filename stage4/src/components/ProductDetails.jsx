import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductContext } from './context/productContext';
import API_URL from '../api/client';

const ProductDetails = () => {
  const { id } = useParams(); const { addToCart, toggleWishlist, isWishlisted } = useContext(ProductContext); const [product,setProduct]=useState(null); const [added,setAdded]=useState(false);
  useEffect(()=>{axios.get(`${API_URL}/Products/${id}`).then(r=>setProduct(r.data)).catch(console.error)},[id]);
  if(!product)return <div className="detail-loading">Loading product…</div>;
  const price=Number(product.price); const discount=Number(product.discount||0); const old=discount?Math.round(price/(1-discount/100)):null;
  const money=v=>`₹${Number(v).toLocaleString('en-IN')}`;
  const add=async()=>{const ok=await addToCart(product.id);if(!ok){window.location.href='/login';return;}setAdded(true);setTimeout(()=>setAdded(false),1800)};
  const saved=isWishlisted(product.id);
  return <div className="detail-page"><div className="detail-breadcrumb"><Link to="/product">Collection</Link><span>/</span><span>{product.category||'Product'}</span><span>/</span><strong>{product.name}</strong></div><div className="detail-layout"><div className="detail-image"><span className="detail-badge">{product.featured?'FEATURED':'NEXORA SELECT'}</span><img src={product.img} alt={product.name}/><div className="detail-image-fallback"><span>{product.category}</span><strong>{product.brand||'NEXORA'}</strong></div></div><div className="detail-copy"><span className="eyebrow">{product.brand||'NEXORA SELECT'} / {product.category||'TECHNOLOGY'}</span><h1>{product.name}</h1><div className="detail-rating">★ {product.rating||'4.8'} <span>•</span> 124 reviews</div><div className="detail-price"><strong>{money(price)}</strong>{old&&<del>{money(old)}</del>} {discount>0&&<span>-{discount}%</span>}</div><p className="detail-description">{product.description||'Designed for people who expect more from their technology. Explore the specifications, compare your options and make the choice that fits your world.'}</p><div className="detail-specs"><div><span>AVAILABILITY</span><strong>{Number(product.stock)>0?`${product.stock} units ready`:'Out of stock'}</strong></div><div><span>SMART MATCH</span><strong>{Math.min(98,80+Number(product.rating||4)*3)} / 100</strong></div><div><span>CATEGORY</span><strong>{product.category||'Technology'}</strong></div></div><div className="detail-actions"><button className="detail-wishlist" onClick={()=>toggleWishlist(product.id)}>{saved?'♥ Saved':'♡ Save'}</button><button className="detail-add" disabled={!Number(product.stock)} onClick={add}>{added?'✓ Added to cart':'Add to cart'}<span>→</span></button><Link to="/cartItems" className="detail-cart">View cart</Link></div><div className="detail-note">↳ Database-linked inventory • Price and availability are retrieved from the product record.</div></div></div></div>;
};
export default ProductDetails;
