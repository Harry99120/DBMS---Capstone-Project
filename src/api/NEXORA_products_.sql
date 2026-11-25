CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(100),
    category_id VARCHAR(20) REFERENCES categories(id),
    price NUMERIC(12,2) NOT NULL,
    discount NUMERIC(5,2) DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    rating NUMERIC(3,1),
    featured BOOLEAN DEFAULT FALSE,
    img TEXT,
    description TEXT,
    short_description TEXT
);

INSERT INTO categories (id, name) VALUES
('C001', 'Laptops'),
('C002', 'Smartphones'),
('C003', 'Audio'),
('C004', 'Wearables'),
('C005', 'Cameras')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO products
(id, name, brand, category, category_id, price, discount, stock, rating, featured, img, description, short_description)
VALUES
('P1001', 'MacBook Air M3', 'Apple', 'Laptops', 'C001', 99999, 12, 18, 4.9, TRUE, 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=85', 'A thin, powerful laptop designed for work, creation and everyday performance.', 'Lightweight performance with all-day capability.'),
('P1002', 'Galaxy S25 Ultra', 'Samsung', 'Smartphones', 'C002', 129999, 8, 10, 4.8, TRUE, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85', 'A premium smartphone with a high-resolution display, powerful camera system and flagship performance.', 'Flagship performance in a refined form.'),
('P1003', 'WH-1000XM6', 'Sony', 'Audio', 'C003', 34999, 10, 7, 4.8, TRUE, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85', 'Premium wireless headphones engineered for immersive listening and focused work.', 'Immersive sound. Serious noise control.'),
('P1004', 'Apple Watch Series 10', 'Apple', 'Wearables', 'C004', 46999, 7, 24, 4.7, TRUE, 'https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=1200&q=85', 'A connected wearable built around health, communication and everyday convenience.', 'Your day, intelligently connected.'),
('P1005', 'iPad Pro M5', 'Apple', 'Laptops', 'C001', 119999, 9, 9, 4.9, TRUE, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=85', 'A powerful tablet experience for creators, students and professionals.', 'Desktop-class ambition in a tablet.'),
('P1006', 'Alpha A6700', 'Sony', 'Cameras', 'C005', 124990, 6, 5, 4.8, FALSE, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85', 'A compact mirrorless camera built for detailed stills and cinematic video.', 'Capture detail. Create with intent.'),
('P1007', 'Pixel Pro', 'Google', 'Smartphones', 'C002', 89999, 11, 16, 4.6, FALSE, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=85', 'A clean Android experience with advanced computational photography.', 'Clean software. Brilliant photography.'),
('P1008', 'QuietComfort Ultra', 'Bose', 'Audio', 'C003', 37999, 5, 13, 4.7, FALSE, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=85', 'Comfort-focused wireless audio with deep noise cancellation.', 'Quiet spaces, wherever you are.'),
('P1009', 'Watch GT Pro', 'Huawei', 'Wearables', 'C004', 27999, 15, 4, 4.5, FALSE, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85', 'A premium wearable with a bright display and long battery life.', 'Minimal design. Maximum everyday utility.'),
('P1010', 'XPS 14', 'Dell', 'Laptops', 'C001', 139990, 10, 6, 4.7, FALSE, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=85', 'A refined performance laptop for demanding workflows.', 'Serious power in a precise chassis.'),
('P1011', 'MX Master 3S', 'Logitech', 'Audio', 'C003', 8999, 18, 32, 4.6, FALSE, 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=85', 'A precision wireless mouse designed for productive workflows.', 'Precision control for long workdays.'),
('P1012', 'Nothing Phone Pro', 'Nothing', 'Smartphones', 'C002', 54999, 14, 21, 4.5, FALSE, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=85', 'A distinctive smartphone focused on clean design and a smooth user experience.', 'Different by design.')
ON CONFLICT (id) DO UPDATE SET
    name=EXCLUDED.name,
    brand=EXCLUDED.brand,
    category=EXCLUDED.category,
    category_id=EXCLUDED.category_id,
    price=EXCLUDED.price,
    discount=EXCLUDED.discount,
    stock=EXCLUDED.stock,
    rating=EXCLUDED.rating,
    featured=EXCLUDED.featured,
    img=EXCLUDED.img,
    description=EXCLUDED.description,
    short_description=EXCLUDED.short_description;

-- Verification
SELECT id, name, brand, category, category_id, price, discount, stock, rating, featured FROM products ORDER BY id;
