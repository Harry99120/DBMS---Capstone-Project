# NEXORA REST API — DEMONSTRATION SPECIFICATION

> **DEMO ONLY — NOT A WORKING API**
>
> This document is intentionally standalone and is not connected to the NEXORA React application.
> The example host uses `demo.invalid`, a reserved non-routable domain.

## Architecture shown for presentation

React Frontend → Axios → REST API Layer → PostgreSQL-style relational database

## Product endpoints

| Method | Endpoint | Operation |
|---|---|---|
| GET | `/api/v1/products` | Read products |
| GET | `/api/v1/products/{productId}` | Read one product |
| POST | `/api/v1/products` | Create product |
| PUT | `/api/v1/products/{productId}` | Update product |
| DELETE | `/api/v1/products/{productId}` | Delete product |
| PATCH | `/api/v1/products/{productId}/inventory` | Update stock |

## Example request

```http
POST https://demo.invalid/api/v1/products
Content-Type: application/json

{
  "product_name": "MacBook Air M3",
  "brand": "Apple",
  "category_id": "C001",
  "price": 99999.00,
  "stock_quantity": 18
}
```

## Example response

```json
{
  "product_id": "P1001",
  "status": "created",
  "message": "Demo response — no real request was sent."
}
```

## Order flow shown conceptually

```text
POST /orders
      ↓
POST /orders/{orderId}/items
      ↓
PATCH /products/{productId}/inventory
      ↓
GET /orders/{orderId}
```

This is a presentation model of the intended data flow, not an implementation claim.
