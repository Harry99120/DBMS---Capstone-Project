import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from './context/productContext';
import './Cart.css';

const money = v => `₹${Number(v || 0).toLocaleString('en-IN')}`;

const Cart = () => {
  const { cartItems, getProduct, getProductName, getProductPrice, getImage, handleIncrement, handleDecrement, handleDelete, subtotal, productDiscount, shipping, tax, totalPrice } = useContext(ProductContext);
  return <div className="cart-page">
    <div className="cart-head"><div><span className="eyebrow">NEXORA / CART</span><h1>Your selection.</h1></div><span>{cartItems.reduce((s,x)=>s+Number(x.quantity||0),0)} items</span></div>
    {!cartItems.length ? <div className="empty-cart"><div className="empty-icon">＋</div><h2>Your cart is waiting.</h2><p>Add something worth bringing home.</p><Link className="primary-button" to="/product">Browse collection <span>→</span></Link></div> : <div className="cart-layout"><div className="cart-lines">{cartItems.map(item=>{const p=getProduct(item.productId); const lineTotal=getProductPrice(item.productId,item.quantity); const remaining=Math.max(0,Number(p?.stock||0)-Number(item.quantity)); return <article className="cart-line" key={item.productId}><div className="cart-line-image"><img src={getImage(item.productId)} alt={getProductName(item.productId)}/></div><div className="cart-line-main"><div className="cart-line-top"><div><span>{p?.brand||'Nexora Select'}</span><h3>{getProductName(item.productId)}</h3><p>{p?.category||'Technology'} • {p?.rating||'—'} ★</p>{remaining>0&&remaining<=5?<div className="stock-note">Only {remaining} more available after this selection</div>:null}</div><strong>{money(lineTotal)}</strong></div><div className="cart-line-bottom"><div className="qty"><button onClick={()=>handleDecrement(item.productId)}>−</button><span>{item.quantity}</span><button onClick={()=>handleIncrement(item.productId)}>＋</button></div><button className="remove" onClick={()=>handleDelete(item.productId)}>Remove</button></div></div></article>})}</div><aside className="summary-card"><span className="eyebrow">ORDER SUMMARY</span><div className="summary-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-row discount"><span>Product savings</span><strong>− {money(productDiscount)}</strong></div><div className="summary-row"><span>Delivery</span><strong>{shipping?'₹99':'Free'}</strong></div><div className="summary-row"><span>Tax (18%)</span><strong>{money(tax)}</strong></div><div className="summary-total"><span>Total</span><strong>{money(totalPrice)}</strong></div><Link className="checkout-button" to="/checkout">Continue to secure checkout <span>→</span></Link><p className="secure-note">⌁ Your cart is persisted through the API. Checkout creates an Order + OrderItems records and updates inventory.</p></aside></div>}
  </div>;
};
export default Cart;
