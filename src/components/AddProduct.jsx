import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/productApi";

const AddProduct = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await createProduct({
        id: data.id || undefined,
        name: data.name,
        price: Number(data.price),
        img: data.img,
        description: data.description || data.name,
        shortDescription: data.description || data.name,
        category: data.category || "Technology",
        brand: data.brand || "NEXORA Select",
        stock: Number(data.stock || 0),
        discount: Number(data.discount || 0),
        rating: Number(data.rating || 4.5)
      });
      alert("Product added to the live catalogue");
      navigate("/adminProduct");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to add product");
    }
  };

  return (
    <div className="edit-product-form">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>ID (optional):</label><input {...register("id")} placeholder="Auto-generated if blank" />
        <label>Name:</label><input {...register("name", { required: true })} />
        <label>Brand:</label><input {...register("brand")} />
        <label>Category:</label><input {...register("category")} placeholder="Technology" />
        <label>Price (₹):</label><input type="number" {...register("price", { required: true })} />
        <label>Stock:</label><input type="number" {...register("stock")} defaultValue="0" />
        <label>Discount (%):</label><input type="number" {...register("discount")} defaultValue="0" />
        <label>Rating:</label><input type="number" step="0.1" {...register("rating")} defaultValue="4.5" />
        <label>Image URL:</label><input {...register("img")} placeholder="https://..." />
        <label>Description:</label><textarea {...register("description")} rows="4" />
        <input type="submit" value="Add Product" />
      </form>
    </div>
  );
};

export default AddProduct;
