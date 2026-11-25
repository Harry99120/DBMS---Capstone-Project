import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import API_URL from '../api/client';
import './Login.css';

const Login = () => {
  const { register, handleSubmit, formState:{errors} } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async data => {
    setLoading(true); setError('');
    try {
      const admin = await axios.get(`${API_URL}/Admin?email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`);
      if (admin.data.length) {
        const a=admin.data[0]; sessionStorage.setItem('adminId',a.id); sessionStorage.setItem('adminName',a.name); sessionStorage.setItem('adminEmail',a.email); window.dispatchEvent(new Event('nexora-session')); navigate('/adminProduct'); return;
      }
      const users = await axios.get(`${API_URL}/Users?email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`);
      if (users.data.length) {
        const u=users.data[0]; sessionStorage.setItem('userId',u.id); sessionStorage.setItem('userName',u.name); sessionStorage.setItem('userEmail',u.email); window.dispatchEvent(new Event('nexora-session')); navigate('/product'); return;
      }
      setError('Invalid email or password. Please try again.');
    } catch { setError('Unable to connect to the commerce API. Start the database server and try again.'); }
    finally { setLoading(false); }
  };

  return <div className="auth-page"><div className="auth-art"><span className="eyebrow">NEXORA / ACCESS</span><h1>Welcome<br /><em>back.</em></h1><p>Your products, your cart, your commerce workspace — all in one place.</p><div className="auth-art-card"><span>SECURE SESSION</span><strong>Database-connected<br />commerce portal</strong><div>● ● ● ●</div></div></div><div className="auth-panel"><div className="auth-brand"><span className="brand-mark">N</span><span>NEXORA</span></div><div className="auth-form-wrap"><span className="eyebrow">SIGN IN</span><h2>Continue your journey.</h2><p className="auth-sub">Use your account credentials to access the marketplace.</p><form onSubmit={handleSubmit(handleLogin)}><label>Email<input type="email" placeholder="you@example.com" {...register('email',{required:'Email is required'})}/>{errors.email&&<small>{errors.email.message}</small>}</label><label>Password<input type="password" placeholder="••••••••" {...register('password',{required:'Password is required'})}/>{errors.password&&<small>{errors.password.message}</small>}</label>{error&&<div className="auth-error">{error}</div>}<button className="auth-submit" disabled={loading}>{loading?'Authenticating…':'Sign in'} <span>→</span></button></form><div className="auth-divider"><span>NEW TO NEXORA?</span></div><Link to="/registration" className="auth-secondary">Create a free account</Link><div className="demo-note"><strong>Presentation demo</strong><br />Customer: virat@nexora.com / User@123<br />Admin: admin@nexora.com / Admin@123</div></div></div></div>;
};
export default Login;
