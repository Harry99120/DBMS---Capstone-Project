import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Product from './components/Product';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import Login from './components/Login';
import ProductDetails from './components/ProductDetails';
import Registeration from './components/Registeration';
import AdminProduct from './components/adminProduct';
import Cart from './components/cart';
import SmartMatch from './components/SmartMatch';
import Wishlist from './components/Wishlist';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import { ProductProvider } from './components/context/productContext';
import ScrollToTop from './components/ScrollToTop';
import SiteFooter from './components/SiteFooter';
import NotFound from './components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ProductProvider>
        <div className="App">
          <Navigation />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registeration />} />
              <Route path="/product" element={<Product />} />
              <Route path="/productDetails/:id" element={<ProductDetails />} />
              <Route path="/cartItems" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/smart-match" element={<SmartMatch />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/addProduct" element={<AddProduct />} />
              <Route path="/editProduct/:id" element={<EditProduct />} />
              <Route path="/adminProduct" element={<AdminProduct />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <SiteFooter />
        </div>
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;
