import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../api/client';
import { fetchProducts, updateProduct as updateRemoteProduct, deleteProduct as deleteRemoteProduct } from '../api/productApi';
import './adminProduct.css';

const TABLES = ['Products', 'Users', 'Categories', 'Carts', 'CartItems', 'Orders', 'OrderItems', 'Wishlist'];
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

function AdminProduct() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [table, setTable] = useState('Products');
  const [records, setRecords] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [consoleQuery, setConsoleQuery] = useState('SELECT * FROM Products');
  const [consoleResult, setConsoleResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const flash = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  const loadCore = useCallback(async () => {
    const [p, o, u] = await Promise.all([
      fetchProducts(),
      axios.get(`${API_URL}/Orders`),
      axios.get(`${API_URL}/Users`),
    ]);
    setProducts(p);
    setOrders(o.data);
    setUsers(u.data);
  }, []);

  const loadTable = useCallback(async (name) => {
    setLoading(true);
    try {
      if (name === 'Products') {
        setRecords(await fetchProducts());
      } else {
        const response = await axios.get(`${API_URL}/${name}`);
        setRecords(response.data);
      }
    } catch (error) {
      flash(`Unable to read ${name}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCore().catch(() => flash('Database connection unavailable')); }, [loadCore]);
  useEffect(() => { if (activeTab === 'tables') loadTable(table); }, [activeTab, table, loadTable]);

  const revenue = useMemo(() => orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0), [orders]);
  const lowStock = useMemo(() => products.filter((p) => Number(p.stock) <= 5), [products]);
  const avgRating = useMemo(() => products.length ? (products.reduce((s, p) => s + Number(p.rating || 0), 0) / products.length).toFixed(1) : '0.0', [products]);
  const categories = useMemo(() => new Set(products.map((p) => p.category)).size, [products]);
  const delivered = orders.filter((o) => String(o.status).toLowerCase() === 'delivered').length;
  const activeOrders = orders.length - delivered;
  const filteredProducts = useMemo(() => products.filter((p) => `${p.name} ${p.brand} ${p.category} ${p.id}`.toLowerCase().includes(query.toLowerCase())), [products, query]);

  const deleteProduct = async (id) => {
    if (!window.confirm(`Delete product ${id}? This removes the product from the live catalogue view.`)) return;
    try {
      await deleteRemoteProduct(id);
      setProducts((current) => current.filter((p) => p.id !== id));
      if (table === 'Products') setRecords((current) => current.filter((p) => p.id !== id));
      flash(`DELETE /products/${id} completed`);
    } catch (error) { flash('Delete failed'); }
  };

  const logout = () => { sessionStorage.clear(); navigate('/'); };

  const runQuery = async () => {
    const q = consoleQuery.trim();
    if (!q) return;
    setConsoleResult({ type: 'info', message: 'Executing against the configured REST API…' });
    try {
      const select = q.match(/^SELECT\s+\*\s+FROM\s+(\w+)\s*;?$/i);
      const update = q.match(/^UPDATE\s+(\w+)\s+SET\s+(\w+)\s*=\s*['"]?([^'"\s]+)['"]?\s+WHERE\s+id\s*=\s*['"]([^'"]+)['"]\s*;?$/i);
      const remove = q.match(/^DELETE\s+FROM\s+(\w+)\s+WHERE\s+id\s*=\s*['"]([^'"]+)['"]\s*;?$/i);

      if (select) {
        const collection = select[1];
        const rows = collection.toLowerCase() === 'products' ? await fetchProducts() : (await axios.get(`${API_URL}/${collection}`)).data;
        setConsoleResult({ type: 'success', message: `SELECT returned ${rows.length} record(s).`, rows: rows.slice(0, 20) });
        return;
      }
      if (update) {
        const [, collection, field, rawValue, id] = update;
        const numericFields = ['price', 'discount', 'stock', 'rating', 'quantity', 'unitPrice', 'totalPrice'];
        const value = numericFields.includes(field) && !Number.isNaN(Number(rawValue)) ? Number(rawValue) : rawValue;
        if (collection.toLowerCase() === 'products') {
          const updated = await updateRemoteProduct(id, { [field]: value });
          setConsoleResult({ type: 'success', message: `UPDATE changed 1 live product record.`, rows: [updated] });
        } else {
          const response = await axios.patch(`${API_URL}/${collection}/${id}`, { [field]: value });
          setConsoleResult({ type: 'success', message: `UPDATE changed 1 record in ${collection}.`, rows: [response.data] });
        }
        await loadCore();
        if (table === collection) await loadTable(collection);
        return;
      }
      if (remove) {
        const [, collection, id] = remove;
        if (collection.toLowerCase() === 'products') await deleteRemoteProduct(id);
        else await axios.delete(`${API_URL}/${collection}/${id}`);
        setConsoleResult({ type: 'success', message: `DELETE removed ${id} from ${collection}.`, rows: [] });
        await loadCore();
        if (table === collection) await loadTable(collection);
        return;
      }
      setConsoleResult({ type: 'error', message: "Supported demo syntax: SELECT * FROM Products; | UPDATE Products SET stock = 15 WHERE id = 'P1001'; | DELETE FROM Products WHERE id = 'P1001';" });
    } catch (error) { setConsoleResult({ type: 'error', message: error.response?.data?.message || error.message || 'Query failed.' }); }
  };

  const tablePreview = (rows) => {
    if (!rows.length) return <div className="empty-records">No records found.</div>;
    const columns = Object.keys(rows[0]).slice(0, 6);
    return <div className="record-table-wrap"><table className="record-table"><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={row.id || i}>{columns.map((c) => <td key={c}>{typeof row[c] === 'object' ? JSON.stringify(row[c]).slice(0, 90) : String(row[c] ?? '—')}</td>)}</tr>)}</tbody></table></div>;
  };

  return (
    <div className="admin-page">
      {toast && <div className="admin-toast">✓ {toast}</div>}
      <div className="admin-top"><div><span className="eyebrow">NEXORA / DATABASE CONTROL CENTER</span><h1>Commerce command.</h1><p>One workspace for catalogue records, relationships, inventory and transaction data.</p></div><button className="admin-logout" onClick={logout}>Sign out ↪</button></div>

      <div className="admin-nav">{[['overview', 'Overview'], ['tables', 'Tables'], ['relationships', 'Relationships'], ['queries', 'Query console']].map(([id, label]) => <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>{label}</button>)}</div>

      {activeTab === 'overview' && <>
        <div className="metric-grid"><div><span>CATALOGUE</span><strong>{products.length}</strong><small>products</small></div><div><span>CUSTOMERS</span><strong>{users.length}</strong><small>registered users</small></div><div><span>ORDERS</span><strong>{orders.length}</strong><small>order records</small></div><div><span>REVENUE</span><strong>{money(revenue)}</strong><small>recorded orders</small></div></div>
        <div className="insight-grid">
          <section className="insight-card dark-card"><span>DATABASE HEALTH</span><h3>Persistent commerce layer</h3><p>React → Axios → REST APIs → Product API + JSON Server</p><div className="health-row"><b>API</b><span className="pill green">CONNECTED</span></div><div className="health-row"><b>TABLES</b><span>{TABLES.length} collections</span></div></section>
          <section className="insight-card"><span>CATALOGUE QUALITY</span><h3>{avgRating}/5 average rating</h3><div className="bar"><i style={{ width: `${Number(avgRating) / 5 * 100}%` }} /></div><div className="mini-stats"><span>{categories} categories</span><span>{lowStock.length} low-stock items</span></div></section>
          <section className="insight-card"><span>ORDER PIPELINE</span><h3>{activeOrders} active / {delivered} delivered</h3><div className="order-bars"><i style={{ width: `${orders.length ? Math.max(8, activeOrders / orders.length * 100) : 0}%` }} /><i style={{ width: `${orders.length ? Math.max(8, delivered / orders.length * 100) : 0}%` }} /></div><div className="mini-stats"><span>Active</span><span>Delivered</span></div></section>
        </div>
        <section className="admin-body"><div className="admin-toolbar"><div><span className="eyebrow">PRODUCT TABLE</span><h2>Inventory management</h2></div><div className="admin-tools"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search catalogue…"/><Link to="/addProduct" className="add-product">＋ Add product</Link></div></div><div className="db-callout"><div><span>DATABASE LAYER</span><strong>Products → live REST API → catalogue record</strong></div><span>SELECT • INSERT • UPDATE • DELETE</span></div><div className="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead><tbody>{filteredProducts.map((p) => <tr key={p.id}><td><div className="admin-product"><img src={p.img} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} /><div><strong>{p.name}</strong><span>{p.brand} • {p.id}</span></div></div></td><td>{p.category || '—'}</td><td>{money(p.price)}</td><td><span className={Number(p.stock) < 6 ? 'stock-alert' : 'stock-ok'}>{p.stock ?? '—'}</span></td><td>★ {p.rating || '—'}</td><td className="actions"><Link to={`/editProduct/${p.id}`}>Edit</Link><button onClick={() => deleteProduct(p.id)}>Delete</button></td></tr>)}</tbody></table></div></section>
      </>}

      {activeTab === 'tables' && <section className="admin-body database-panel"><div className="database-header"><div><span className="eyebrow">RELATIONAL DATA VIEW</span><h2>Explore database tables.</h2><p>Product records are read from the live product API; transactional collections remain on the NEXORA JSON REST backend.</p></div><span className="api-badge">API · {table === 'Products' ? 'DummyJSON' : API_URL}</span></div><div className="table-selector">{TABLES.map((name) => <button key={name} className={table === name ? 'selected' : ''} onClick={() => setTable(name)}>{name}<span>{table === name ? records.length : 'view'}</span></button>)}</div><div className="record-toolbar"><div><span className="eyebrow">SELECT *</span><h3>{table}</h3></div><button onClick={() => loadTable(table)}>↻ Refresh</button></div>{loading ? <div className="loading-state">Reading persistent records…</div> : tablePreview(records)}</section>}

      {activeTab === 'relationships' && <section className="admin-body relationship-panel"><div><span className="eyebrow">DATA MODEL</span><h2>How the commerce records connect.</h2><p>This view is designed for the DBMS viva: entities are separated into collections and linked by identifiers.</p></div><div className="relationship-map"><div className="entity users"><b>USERS</b><span>id · name · email · role</span></div><div className="entity carts"><b>CARTS</b><span>id · userId</span></div><div className="entity orders"><b>ORDERS</b><span>id · userId · totalPrice · status</span></div><div className="entity cartitems"><b>CART ITEMS</b><span>id · cartId · productId · quantity</span></div><div className="entity products"><b>PRODUCTS</b><span>id · categoryId · price · stock</span></div><div className="entity orderitems"><b>ORDER ITEMS</b><span>id · orderId · productId · quantity</span></div><div className="entity categories"><b>CATEGORIES</b><span>id · name</span></div><div className="entity wishlist"><b>WISHLIST</b><span>id · userId · productId</span></div><div className="connector c1">userId ↓</div><div className="connector c2">cartId →</div><div className="connector c3">productId →</div><div className="connector c4">categoryId →</div><div className="connector c5">orderId →</div></div><div className="relationship-note"><strong>Key idea:</strong> identifiers such as <code>userId</code>, <code>productId</code>, <code>orderId</code> and <code>categoryId</code> connect records without duplicating the whole entity.</div></section>}

      {activeTab === 'queries' && <section className="admin-body query-panel"><div className="database-header"><div><span className="eyebrow">REST-BACKED QUERY CONSOLE</span><h2>Inspect the data layer.</h2><p>Use SQL-like commands for demonstration. The console translates supported commands into real REST CRUD operations.</p></div><span className="api-badge">REST APIs · LIVE</span></div><div className="query-editor"><div className="terminal-head"><span>nexora-db</span><span>GET / PATCH / DELETE</span></div><textarea value={consoleQuery} onChange={(e) => setConsoleQuery(e.target.value)} spellCheck="false" /><div className="query-actions"><button onClick={runQuery}>▶ Execute query</button><div className="query-examples"><button onClick={() => setConsoleQuery('SELECT * FROM Products')}>SELECT</button><button onClick={() => setConsoleQuery("UPDATE Products SET stock = 15 WHERE id = 'P1001'")}>UPDATE</button><button onClick={() => setConsoleQuery("DELETE FROM Products WHERE id = 'P1012'")}>DELETE</button></div></div></div>{consoleResult && <div className={`query-result ${consoleResult.type}`}><div className="result-head"><span>{consoleResult.type === 'success' ? '✓' : consoleResult.type === 'error' ? '!' : '•'}</span><strong>{consoleResult.message}</strong></div>{consoleResult.rows && tablePreview(consoleResult.rows)}</div>}<div className="query-help"><div><b>SELECT</b><span>Reads collection records.</span></div><div><b>UPDATE</b><span>Changes one field on an existing record.</span></div><div><b>DELETE</b><span>Removes a persistent record.</span></div><div><b>INSERT</b><span>Use the Add Product form to create a new product through POST.</span></div></div></section>}
    </div>
  );
}

export default AdminProduct;
