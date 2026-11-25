# NEXORA — Ecommerce Management System

## Architecture

NEXORA uses two API layers:

1. **Product catalogue API** — live REST requests to `https://dummyjson.com/products` using Axios.
2. **NEXORA application API** — JSON Server for users, carts, orders, order items and wishlist data.

The product catalogue is normalized by `src/api/productApi.js` into the shape expected by the existing React UI.

### Product API

- `GET https://dummyjson.com/products?limit=0` — load catalogue
- `GET https://dummyjson.com/products/{id}` — load one product
- `POST https://dummyjson.com/products/add` — simulated product creation
- `PUT https://dummyjson.com/products/{id}` — simulated product update
- `DELETE https://dummyjson.com/products/{id}` — simulated product deletion

DummyJSON documents that product write operations are simulated and are not permanently stored on its server. NEXORA therefore keeps product overrides/deletions in browser localStorage so the UI remains consistent during a demo session.

## Local development

```bash
npm install
npm start
```

If you want the NEXORA JSON REST backend locally for login/cart/orders:

```bash
npm run start-server
```

Then open `http://localhost:3000`.

## Production deployment

### Netlify

The included `netlify.toml` uses:

```text
Build command: npm run build
Publish directory: build
```

Set `REACT_APP_API_URL` in Netlify to your deployed NEXORA JSON-server URL (for example, the public Render service URL).

`REACT_APP_PRODUCT_API_URL` is already configured as `https://dummyjson.com` in `.env.production` and requires no secret.

### Render API

The included `render.yaml` can deploy the JSON Server used for users, carts, orders, order items and wishlist.

## Important

`src/api/db.json` is still the transactional application datastore for the local JSON REST backend. It is **not** used as the product catalogue source anymore.
