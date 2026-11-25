import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProduct, updateProduct } from "../api/productApi";
import "./EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct(id).then((p) => {
      setProduct(p);
      ["id", "name", "price", "img", "brand", "category", "stock", "discount", "rating", "description"].forEach((field) => setValue(field, p[field] ?? ""));
    }).catch(() => setError("Product could not be loaded from the live product API."));
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await updateProduct(id, {
        name: data.name,
        price: Number(data.price),
        img: data.img,
        brand: data.brand,
        category: data.category,
        stock: Number(data.stock || 0),
        discount: Number(data.discount || 0),
        rating: Number(data.rating || 0),
        description: data.description,
        shortDescription: data.description
      });
      alert("Product updated in the live catalogue");
      navigate("/adminProduct");
    } catch (e) {
      alert(e.response?.data?.message || "Unable to update product");
    }
  };

  if (error) return <div className="edit-product-form"><h2>{error}</h2></div>;
  if (!product) return <div className="edit-product-form"><h2>Loading live product…</h2></div>;

  return (
    <div className="edit-product-form">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>ID:</label><input {...register("id")} disabled />
        <label>Name:</label><input {...register("name", { required: true })} />
        <label>Brand:</label><input {...register("brand")} />
        <label>Category:</label><input {...register("category")} />
        <label>Price (₹):</label><input type="number" {...register("price", { required: true })} />
        <label>Stock:</label><input type="number" {...register("stock")} />
        <label>Discount (%):</label><input type="number" {...register("discount")} />
        <label>Rating:</label><input type="number" step="0.1" {...register("rating")} />
        <label>Image URL:</label><input {...register("img")} />
        <label>Description:</label><textarea {...register("description")} rows="4" />
        <input type="submit" value="Update Product" />
      </form>
    </div>
  );
};

export default EditProduct;
