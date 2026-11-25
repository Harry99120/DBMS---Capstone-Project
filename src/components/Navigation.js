import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ProductContext } from './context/productContext';

const Navigation = () => {
  const navigate = useNavigate();
  const { totalCart, wishlist } = useContext(ProductContext);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const refreshSession = () => {
    setUser(sessionStorage.getItem('userId') ? { id: sessionStorage.getItem('userId'), name: sessionStorage.getItem('userName') || 'Customer' } : null);
    setAdmin(sessionStorage.getItem('adminId') ? { id: sessionStorage.getItem('adminId'), name: sessionStorage.getItem('adminName') || 'Administrator' } : null);
  };

  useEffect(() => {
    refreshSession();
    window.addEventListener('storage', refreshSession);
    window.addEventListener('nexora-session', refreshSession);
    return () => {
      window.removeEventListener('storage', refreshSession);
      window.removeEventListener('nexora-session', refreshSession);
    };
  }, []);

  const logout = () => {
    setMobileOpen(false);
    sessionStorage.clear();
    window.dispatchEvent(new Event('nexora-session'));
    navigate('/');
  };

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <Link to="/" className="brand" aria-label="Nexora home">
          <span className="brand-mark">N</span><span>NEXORA</span>
        </Link>
        <button className="mobile-menu-button" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle navigation">☰</button>
        <nav className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`} onClick={() => setMobileOpen(false)}>
          <Link to="/product">Shop</Link>
          <Link to="/product">Collections</Link>
          <Link to="/smart-match">Smart Match</Link>
          <Link to="/#principle">About</Link>
        </nav>
        <div className="nav-actions">
          {admin ? <><Link className="nav-pill" to="/adminProduct">Control center</Link><button className="nav-icon-button" onClick={logout}>↪</button></> : user ? <>
            <span className="nav-user">Hi, {user.name.split(' ')[0]}</span><Link className="nav-orders" to="/orders">Orders</Link>
            <Link className="nav-wish" to="/wishlist" title="Wishlist">♡<b>{wishlist.length}</b></Link><Link className="nav-cart" to="/cartItems" title="Cart">🛒<b>{totalCart}</b></Link>
            <button className="nav-icon-button" onClick={logout} title="Log out">↪</button>
          </> : <><Link className="nav-login" to="/login">Sign in</Link><Link className="nav-cta" to="/registration">Create account</Link></>}
        </div>
      </div>
    </header>
  );
};
export default Navigation;
