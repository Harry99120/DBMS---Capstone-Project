import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../api/client';
import { fetchProducts } from '../api/productApi';
import { Link } from 'react-router-dom';
import './OrderHistory.css';

const money = v => `₹${Number(v || 0).toLocaleString('en-IN')}`;
const formatDate = value => new Date(value).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

const OrderHistory = () => {
  const [orders,setOrders]=useState([]); const [items,setItems]=useState([]); const [products,setProducts]=useState([]); const [loading,setLoading]=useState(true);
  const userId=sessionStorage.getItem('userId');
  useEffect(()=>{if(!userId){setLoading(false);return;} Promise.all([axios.get(`${API_URL}/Orders?userId=${userId}&_sort=createdAt&_order=desc`),axios.get(`${API_URL}/OrderItems?userId=${userId}`),fetchProducts()]).then(([o,i,p])=>{setOrders(o.data);setItems(i.data);setProducts(p)}).catch(console.error).finally(()=>setLoading(false));},[userId]);
  const itemForOrder=order=>items.filter(i=>String(i.orderId)===String(order.id));
  if(!userId)return <div className="orders-empty"><span className="eyebrow">NEXORA / ORDERS</span><h1>Sign in to see your orders.</h1><Link className="primary-button" to="/login">Sign in <span>→</span></Link></div>;
  return <div className="orders-page"><div className="orders-head"><div><span className="eyebrow">NEXORA / ORDER HISTORY</span><h1>Your orders.</h1><p>Every checkout is persisted as an Order with separate OrderItems records.</p></div><Link className="primary-button" to="/product">Shop again <span>→</span></Link></div>{loading?<div className="orders-loading">Loading your order ledger…</div>:!orders.length?<div className="orders-empty"><div className="empty-icon">＋</div><h2>No orders yet.</h2><p>Your next order will appear here with its database-backed line items.</p><Link className="primary-button" to="/product">Explore collection <span>→</span></Link></div>:<div className="orders-list">{orders.map(order=>{const its=itemForOrder(order);return <article className="order-card" key={order.id}><div className="order-card-head"><div><span className="order-number">{order.orderNumber || `NXR-${order.id}`}</span><h2>{formatDate(order.createdAt)}</h2></div><div className="order-status"><span className="status-dot"></span>{order.status}</div></div><div className="order-items">{its.map(i=><div className="order-item" key={i.id}><div className="order-item-image"><img src={products.find(p=>String(p.id)===String(i.productId))?.img || getImageFallback()} alt=""/></div><div><b>{products.find(p=>String(p.id)===String(i.productId))?.name || `Product ${i.productId}`}</b><span>Quantity {i.quantity} • Unit price {money(i.unitPrice)}</span></div><strong>{money(i.unitPrice*i.quantity)}</strong></div>)}</div><div className="order-bottom"><div><span>Total</span><strong>{money(order.totalPrice)}</strong></div><div><span>Payment</span><strong>{order.paymentStatus || 'Paid (Demo)'}</strong></div><div><span>Delivery</span><strong>{order.shippingAddress?.city || 'Gurugram'}</strong></div></div><div className="tracking"><span className="done">Confirmed</span><i></i><span className={order.status==='Packed'||order.status==='Shipped'||order.status==='Delivered'?'done':''}>Packed</span><i></i><span className={order.status==='Shipped'||order.status==='Delivered'?'done':''}>Shipped</span><i></i><span className={order.status==='Delivered'?'done':''}>Delivered</span></div></article>})}</div>}</div>;
};
const getImageFallback=()=>`https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=200&q=70`;
export default OrderHistory;
