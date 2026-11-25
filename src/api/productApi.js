import axios from 'axios';

const PRODUCT_API_URL = process.env.REACT_APP_PRODUCT_API_URL || 'https://dummyjson.com';
const STORAGE_KEY = 'nexora-product-overrides-v1';
const DELETED_KEY = 'nexora-product-deleted-v1';

const readJson = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
};

const writeJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const getOverrides = () => readJson(STORAGE_KEY, {});
const getDeleted = () => readJson(DELETED_KEY, []);

const saveOverrides = (overrides) => writeJson(STORAGE_KEY, overrides);
const saveDeleted = (deleted) => writeJson(DELETED_KEY, deleted);

const toNexoraId = remoteId => `P${String(1000 + Number(remoteId)).padStart(4, '0')}`;
const toRemoteId = id => {
  const match = String(id).match(/^P(\d+)$/);
  return match ? Number(match[1]) - 1000 : Number(id);
};

const normalizeProduct = (raw) => ({
  id: toNexoraId(raw.id),
  remoteId: raw.id,
  name: raw.title,
  brand: raw.brand || 'NEXORA Select',
  category: raw.category ? raw.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Technology',
  categoryId: `C${String((Number(raw.id) % 5) + 1).padStart(3, '0')}`,
  price: Math.round(Number(raw.price || 0) * 83),
  discount: Math.round(Number(raw.discountPercentage || 0)),
  stock: Number(raw.stock || 0),
  rating: Number(raw.rating || 0),
  featured: Number(raw.id) <= 5,
  img: raw.thumbnail || raw.images?.[0] || '',
  description: raw.description || '',
  shortDescription: raw.description || '',
  images: raw.images || [],
  reviewCount: Number(raw.reviewCount || raw.reviews?.length || 0),
  reviews: raw.reviews || [],
  sourceApi: 'DummyJSON'
});

const applyLocalState = product => {
  const overrides = getOverrides();
  const deleted = getDeleted();
  if (deleted.includes(String(product.id))) return null;
  return { ...product, ...(overrides[product.id] || {}) };
};

export const fetchProducts = async () => {
  const response = await axios.get(`${PRODUCT_API_URL}/products?limit=0`);
  return (response.data.products || []).map(normalizeProduct).map(applyLocalState).filter(Boolean);
};

export const fetchProduct = async id => {
  const localId = String(id);
  const overrides = getOverrides();
  const deleted = getDeleted();
  if (deleted.includes(localId)) throw new Error('Product not found');

  const remoteId = toRemoteId(localId);
  const response = await axios.get(`${PRODUCT_API_URL}/products/${remoteId}`);
  const product = normalizeProduct(response.data);
  return { ...product, ...(overrides[product.id] || {}) };
};

export const createProduct = async product => {
  const payload = {
    title: product.name,
    price: Math.max(1, Math.round(Number(product.price || 0) / 83)),
    description: product.description || product.shortDescription || '',
    category: String(product.category || 'technology').toLowerCase().replace(/\s+/g, '-'),
    brand: product.brand || 'NEXORA Select',
    stock: Number(product.stock || 0),
    thumbnail: product.img || ''
  };
  const response = await axios.post(`${PRODUCT_API_URL}/products/add`, payload);
  const normalized = { ...normalizeProduct(response.data), ...product, id: product.id || toNexoraId(response.data.id) };
  const overrides = getOverrides();
  overrides[normalized.id] = normalized;
  saveOverrides(overrides);
  return normalized;
};

export const updateProduct = async (id, changes) => {
  const remoteId = toRemoteId(id);
  const payload = {
    title: changes.name,
    price: Math.max(1, Math.round(Number(changes.price || 0) / 83)),
    description: changes.description,
    stock: Number(changes.stock || 0)
  };
  await axios.put(`${PRODUCT_API_URL}/products/${remoteId}`, payload);
  const current = await fetchProduct(id);
  const updated = { ...current, ...changes, id: current.id };
  const overrides = getOverrides();
  overrides[id] = updated;
  saveOverrides(overrides);
  return updated;
};

export const deleteProduct = async id => {
  const remoteId = toRemoteId(id);
  await axios.delete(`${PRODUCT_API_URL}/products/${remoteId}`);
  const deleted = getDeleted();
  if (!deleted.includes(String(id))) deleted.push(String(id));
  saveDeleted(deleted);
};

export const persistProductOverride = (id, changes) => {
  const overrides = getOverrides();
  overrides[id] = { ...(overrides[id] || {}), ...changes };
  saveOverrides(overrides);
};

export const PRODUCT_API_BASE_URL = PRODUCT_API_URL;
