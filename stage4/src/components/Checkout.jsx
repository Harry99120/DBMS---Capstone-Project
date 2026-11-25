import React, { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductContext } from './context/productContext';
import './Checkout.css';

const money = v => `₹${Number(v).toLocaleString('en-IN')}`;

const Checkout = () => {
  const ctx = useContext(ProductContext);
  const { cartItems, getProduct, getImage, getProductName, subtotal, productDiscount, discountedSubtotal, shipping, tax, totalPrice, handleOrder } = ctx;
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState(null);
  const [address, setAddress] = useState({ name: sessionStorage.getItem('userName') || '', phone: '', line1: '', city: 'Gurugram', state: 'Haryana', pin: '' });
  const [paymentMethod, setPaymentMethod] = useState('UPI • Demo payment');

  const addressReady = useMemo(() => Object.values(address).every(Boolean) && address.pin.length === 6 && address.phone.length >= 10, [address]);
  if (placed) return <div className="checkout-confirm"><div className="confirm-panel"><div className="success-mark">✓</div><span className="eyebrow">ORDER CONFIRMED</span><h1>Ready to ship.</h1><p>Your order has been written to <b>Orders</b> and each line item to <b>OrderItems</b>. Inventory was updated automatically.</p><div className="confirm-number">{placed.orderNumber}</div><div className="confirm-grid"><div><span>Total paid</span><strong>{money(placed.totalPrice)}</strong></div><div><span>Status</span><strong>{placed.status}</strong></div></div><div className="confirm-actions"><Link className="primary-button" to="/orders">View order history <span>→</span></Link><Link className="text-link" to="/product">Continue shopping</Link></div></div></div>;
  if (!cartItems.length) return <div className="checkout-empty"><span className="eyebrow">NEXORA CHECKOUT</span><h1>Your cart is empty.</h1><p>There is nothing to check out yet.</p><Link className="primary-button" to="/product">Browse collection <span>→</span></Link></div>;

  const placeOrder = async () => {
    setBusy(true); setError('');
    const result = await handleOrder({ paymentMethod, shippingAddress: address });
    setBusy(false);
    if (!result.ok) { setError(result.reason); return; }
    setPlaced(result.order);
  };

  return <div className="checkout-page">
    <div className="checkout-top"><div><span className="eyebrow">NEXORA / SECURE CHECKOUT</span><h1>Complete your order.</h1></div><Link className="back-shop" to="/cartItems">← Back to cart</Link></div>
    <div className="checkout-steps"><div className={step>=1?'active':''}><b>01</b><span>Delivery</span></div><div className={step>=2?'active':''}><b>02</b><span>Payment</span></div><div className={step>=3?'active':''}><b>03</b><span>Review</span></div></div>
    <div className="checkout-grid">
      <section className="checkout-card">
        {step===1 && <div className="step-content"><span className="eyebrow">DELIVERY DETAILS</span><h2>Where should we send it?</h2><div className="form-grid"><label>Full name<input value={address.name} onChange={e=>setAddress({...address,name:e.target.value})} placeholder="Your name"/></label><label>Phone<input value={address.phone} onChange={e=>setAddress({...address,phone:e.target.value.replace(/\D/g,'')})} maxLength="10" placeholder="10 digit mobile"/></label><label className="wide">Address<input value={address.line1} onChange={e=>setAddress({...address,line1:e.target.value})} placeholder="House / street / sector"/></label><label>City<input value={address.city} onChange={e=>setAddress({...address,city:e.target.value})}/></label><label>State<input value={address.state} onChange={e=>setAddress({...address,state:e.target.value})}/></label><label>PIN code<input value={address.pin} onChange={e=>setAddress({...address,pin:e.target.value.replace(/\D/g,'')})} maxLength="6" placeholder="6 digit PIN"/></label></div><button disabled={!addressReady} className="step-button" onClick={()=>setStep(2)}>Continue to payment <span>→</span></button></div>}
        {step===2 && <div className="step-content"><span className="eyebrow">PAYMENT METHOD</span><h2>Choose how to pay.</h2><div className="payment-options">{['UPI • Demo payment','Card • Demo payment','Cash on delivery'].map(method=><button key={method} className={paymentMethod===method?'selected':''} onClick={()=>setPaymentMethod(method)}><span className="radio">{paymentMethod===method?'●':'○'}</span><span><b>{method}</b><small>{method.includes('Demo')?'Simulated for academic presentation':'Pay when your order arrives'}</small></span><span>→</span></button>)}</div><div className="step-actions"><button className="secondary-button" onClick={()=>setStep(1)}>← Delivery</button><button className="step-button" onClick={()=>setStep(3)}>Review order <span>→</span></button></div></div>}
        {step===3 && <div className="step-content"><span className="eyebrow">FINAL REVIEW</span><h2>Everything look right?</h2><div className="review-block"><span>Deliver to</span><p>{address.name}<br/>{address.line1}, {address.city}, {address.state} — {address.pin}<br/>{address.phone}</p></div><div className="review-block"><span>Payment</span><p>{paymentMethod}</p></div><div className="review-block"><span>Items</span>{cartItems.map(i=><div className="review-item" key={i.productId}><img src={getImage(i.productId)} alt=""/><div><b>{getProductName(i.productId)}</b><span>Qty {i.quantity}</span></div><strong>{money(Number(getProduct(i.productId)?.price||0)*i.quantity)}</strong></div>)}</div>{error && <div className="checkout-error">{error}</div>}<div className="step-actions"><button className="secondary-button" onClick={()=>setStep(2)}>← Payment</button><button disabled={busy} className="step-button" onClick={placeOrder}>{busy?'Creating order…':'Place secure demo order'} <span>{busy?'':'✓'}</span></button></div></div>}
      </section>
      <aside className="checkout-summary"><span className="eyebrow">ORDER SUMMARY</span>{cartItems.map(i=><div className="mini-item" key={i.productId}><img src={getImage(i.productId)} alt=""/><div><b>{getProductName(i.productId)}</b><span>Qty {i.quantity}</span></div><strong>{money(Number(getProduct(i.productId)?.price||0)*i.quantity)}</strong></div>)}<div className="price-list"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="discount"><span>Product savings</span><strong>− {money(productDiscount)}</strong></div><div><span>Delivery</span><strong>{shipping?'₹99':'Free'}</strong></div><div><span>Tax (18%)</span><strong>{money(tax)}</strong></div><div className="grand"><span>Total</span><strong>{money(totalPrice)}</strong></div></div><p className="db-note">⌁ DBMS flow: Cart → Order → OrderItems → Inventory update</p></aside>
    </div>
  </div>;
};
export default Checkout;
