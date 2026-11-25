-- NEXORA DBMS DEMONSTRATION ARTIFACT
-- STATUS: DEMO / NON-PRODUCTION
-- This file is intentionally standalone and is NOT connected to the React app.
-- It models a PostgreSQL-style relational design for presentation/academic demonstration.

CREATE TABLE categories (
    category_id VARCHAR(10) PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id VARCHAR(10) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
        CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id VARCHAR(10) PRIMARY KEY,
    product_name VARCHAR(160) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category_id VARCHAR(10) NOT NULL REFERENCES categories(category_id),
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carts (
    cart_id VARCHAR(10) PRIMARY KEY,
    user_id VARCHAR(10) NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    cart_item_id VARCHAR(12) PRIMARY KEY,
    cart_id VARCHAR(10) NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id VARCHAR(10) NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    UNIQUE(cart_id, product_id)
);

CREATE TABLE orders (
    order_id VARCHAR(12) PRIMARY KEY,
    user_id VARCHAR(10) NOT NULL REFERENCES users(user_id),
    order_total NUMERIC(12,2) NOT NULL CHECK (order_total >= 0),
    order_status VARCHAR(30) NOT NULL DEFAULT 'PLACED',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    ordered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id VARCHAR(14) PRIMARY KEY,
    order_id VARCHAR(12) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id VARCHAR(10) NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0)
);

CREATE TABLE wishlists (
    wishlist_id VARCHAR(12) PRIMARY KEY,
    user_id VARCHAR(10) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    product_id VARCHAR(10) NOT NULL REFERENCES products(product_id),
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
