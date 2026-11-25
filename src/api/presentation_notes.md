# PRESENTATION NOTES — NEXORA DBMS DEMO

## 1. Database design
Explain that the relational model separates:
- users
- categories
- products
- carts
- cart_items
- orders
- order_items
- wishlists

## 2. Primary keys
Examples:
- users.user_id
- products.product_id
- orders.order_id
- order_items.order_item_id

## 3. Foreign-key relationships
Examples:
- products.category_id → categories.category_id
- orders.user_id → users.user_id
- order_items.order_id → orders.order_id
- order_items.product_id → products.product_id
- cart_items.cart_id → carts.cart_id
- cart_items.product_id → products.product_id

## 4. CRUD
Create = INSERT / POST
Read   = SELECT / GET
Update = UPDATE / PUT/PATCH
Delete = DELETE

## 5. Important wording
Say: "This is our PostgreSQL-style relational design / proposed schema for the DBMS layer."

Do NOT say PostgreSQL is running in the existing application unless a real PostgreSQL
backend has actually been configured and connected.
