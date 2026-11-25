import axios from 'axios';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import API_URL from '../../api/client';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(() => sessionStorage.getItem('userId'));

  useEffect(() => {
    const syncUser = () => setUserId(sessionStorage.getItem('userId'));
    window.addEventListener('storage', syncUser);
    window.addEventListener('nexora-session', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('nexora-session', syncUser);
    };
  }, []);

  const refreshCart = useCallback(async () => {
    if (!userId) { setCartItems([]); setCartId(null); return; }
    try {
      const res = await axios.get(`${API_URL}/Carts?userId=${userId}`);
      if (res.data.length) { setCartId(res.data[0].id); setCartItems(res.data[0].cartItems || []); }
      else { setCartId(null); setCartItems([]); }
    } catch (e) { console.error('Cart fetch failed', e); }
  }, [userId]);

  const refreshWishlist = useCallback(async () => {
    if (!userId) { setWishlist([]); return; }
    try {
      const res = await axios.get(`${API_URL}/Wishlist?userId=${userId}`);
      setWishlist(res.data.length ? res.data[0].productIds || [] : []);
    } catch (e) { console.error('Wishlist fetch failed', e); }
  }, [userId]);

  useEffect(() => {
    axios.get(`${API_URL}/Products`).then(r => setProducts(r.data)).catch(e => console.error(e)).finally(() => setLoading(false));
    refreshCart();
    refreshWishlist();
  }, [refreshCart, refreshWishlist]);

  const updateCart = async items => {
    if (!userId) return false;
    if (cartId) await axios.put(`${API_URL}/Carts/${cartId}`, { id: cartId, userId, cartItems: items, updatedAt: new Date().toISOString() });
    else { const r = await axios.post(`${API_URL}/Carts`, { userId, cartItems: items, createdAt: new Date().toISOString() }); setCartId(r.data.id); }
    setCartItems(items);
    return true;
  };

  const addToCart = async productId => {
    if (!userId) return false;
    const product = products.find(p => String(p.id) === String(productId));
    if (!product || Number(product.stock) <= 0) return { ok: false, reason: 'out-of-stock' };
    const current = [...cartItems];
    const existing = current.find(x => String(x.productId) === String(productId));
    if (existing && existing.quantity >= Number(product.stock)) return { ok: false, reason: 'stock-limit' };
    const next = existing
      ? current.map(x => String(x.productId) === String(productId) ? { ...x, quantity: x.quantity + 1 } : x)
      : [...current, { productId, quantity: 1 }];
    await updateCart(next);
    return { ok: true };
  };

  const handleIncrement = async id => {
    const product = getProduct(id);
    const current = cartItems.find(x => String(x.productId) === String(id));
    if (!product || !current || current.quantity >= Number(product.stock)) return false;
    return updateCart(cartItems.map(x => String(x.productId) === String(id) ? { ...x, quantity: x.quantity + 1 } : x));
  };

  const handleDecrement = id => updateCart(cartItems.map(x => String(x.productId) === String(id) && x.quantity > 1 ? { ...x, quantity: x.quantity - 1 } : x));
  const handleDelete = id => updateCart(cartItems.filter(x => String(x.productId) !== String(id)));

  const saveWishlist = async next => {
    if (!userId) return false;
    const existing = await axios.get(`${API_URL}/Wishlist?userId=${userId}`);
    if (existing.data.length) await axios.put(`${API_URL}/Wishlist/${existing.data[0].id}`, { id: existing.data[0].id, userId, productIds: next });
    else await axios.post(`${API_URL}/Wishlist`, { userId, productIds: next });
    setWishlist(next);
    return true;
  };

  const toggleWishlist = async productId => {
    if (!userId) return false;
    const exists = wishlist.some(id => String(id) === String(productId));
    const next = exists ? wishlist.filter(id => String(id) !== String(productId)) : [...wishlist, productId];
    return saveWishlist(next);
  };

  const isWishlisted = id => wishlist.some(item => String(item) === String(id));
  const getProduct = id => products.find(p => String(p.id) === String(id));
  const getProductName = id => getProduct(id)?.name || 'Product';
  const getProductPrice = (id, q = 1) => Number(getProduct(id)?.price || 0) * q;
  const getImage = id => getProduct(id)?.img || '';
  const totalCart = useMemo(() => cartItems.reduce((sum, x) => sum + Number(x.quantity || 0), 0), [cartItems]);
  const subtotal = useMemo(() => cartItems.reduce((sum, x) => sum + getProductPrice(x.productId, x.quantity), 0), [cartItems, products]);
  const productDiscount = useMemo(() => cartItems.reduce((sum, x) => {
    const p = getProduct(x.productId);
    return sum + ((Number(p?.price || 0) * Number(p?.discount || 0) / 100) * Number(x.quantity || 0));
  }, 0), [cartItems, products]);
  const discountedSubtotal = Math.max(0, subtotal - productDiscount);
  const shipping = discountedSubtotal >= 2000 || discountedSubtotal === 0 ? 0 : 99;
  const tax = Math.round(discountedSubtotal * 0.18);
  const totalPrice = discountedSubtotal + shipping + tax;

  const handleOrder = async orderInfo => {
    if (!userId || !cartItems.length) return { ok: false, reason: 'empty-cart' };
    try {
      for (const item of cartItems) {
        const p = getProduct(item.productId);
        if (!p || Number(item.quantity) > Number(p.stock)) return { ok: false, reason: `Only ${p?.stock || 0} left for ${p?.name || 'this product'}` };
      }

      const order = {
        userId,
        cartId: cartId || null,
        orderNumber: `NXR-${Date.now().toString().slice(-8)}`,
        subtotal: Math.round(subtotal),
        productDiscount: Math.round(productDiscount),
        shipping,
        tax,
        totalPrice: Math.round(totalPrice),
        status: 'Confirmed',
        paymentStatus: orderInfo.paymentMethod === 'Cash on delivery' ? 'Pending' : 'Paid (Demo)',
        paymentMethod: orderInfo.paymentMethod,
        shippingAddress: orderInfo.shippingAddress,
        createdAt: new Date().toISOString()
      };
      const orderResponse = await axios.post(`${API_URL}/Orders`, order);
      const createdOrder = orderResponse.data;

      await Promise.all(cartItems.map(item => axios.post(`${API_URL}/OrderItems`, {
        orderId: createdOrder.id,
        userId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(getProduct(item.productId)?.price || 0),
        discount: Number(getProduct(item.productId)?.discount || 0)
      })));

      await Promise.all(cartItems.map(async item => {
        const p = getProduct(item.productId);
        const updated = { ...p, stock: Math.max(0, Number(p.stock) - Number(item.quantity)) };
        await axios.put(`${API_URL}/Products/${p.id}`, updated);
        setProducts(prev => prev.map(x => String(x.id) === String(p.id) ? updated : x));
      }));

      if (cartId) await axios.delete(`${API_URL}/Carts/${cartId}`);
      setCartId(null); setCartItems([]);
      return { ok: true, order: createdOrder };
    } catch (error) {
      console.error('Order creation failed', error);
      return { ok: false, reason: 'Order could not be created. Please try again.' };
    }
  };

  return (
    <ProductContext.Provider value={{
      products, setProducts, loading, cartItems, setCartItems, cartId, wishlist,
      totalCart, subtotal, productDiscount, discountedSubtotal, shipping, tax, totalPrice,
      getProduct, getProductName, getProductPrice, getImage, addToCart,
      handleIncrement, handleDecrement, handleDelete, handleOrder,
      toggleWishlist, isWishlisted
    }}>
      {children}
    </ProductContext.Provider>
  );
};
