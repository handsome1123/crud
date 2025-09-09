"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";


interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
}

export default function CreateProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: null as File | null,
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch seller's products
  const fetchProducts = useCallback (async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch("/api/seller/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
      else setError(data.error || "Failed to fetch products");
    } catch {
      setError("Error fetching products");
    } finally {
      setLoadingProducts(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle text/number input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  // Handle file input + preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCreate(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price.toString());
      formData.append("stock", form.stock.toString());
      if (form.image) formData.append("image", form.image);

      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ only Authorization
        },
        body: formData, // ✅ send as FormData
      });

      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to create product");
      else {
        // Clear form
        setForm({ name: "", description: "", price: 0, stock: 0, image: null });
        setPreview(null);
        // Refresh product list
        fetchProducts();
      }
    } catch {
      setError("Error creating product");
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />

        {/* Image preview */}
        {preview && (
          <div className="mt-4">
            <p className="font-medium">Preview:</p>
            <Image src={preview} 
            alt="Preview"
            width={160}
            height={160}
            className="object-cover rounded mt-2" 
            unoptimized
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loadingCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loadingCreate ? "Creating..." : "Create Product"}
        </button>
      </form>

      {/* Product list */}
      <h2 className="text-xl font-bold mb-2">Your Products</h2>
      {loadingProducts ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow hover:shadow-md">
              {p.imageUrl && (
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  width={160}
                  height={160}
                  className="object-cover mb-2 rounded w-full"
                />
              )}
              <h3 className="font-bold">{p.name}</h3>
              <p>{p.description}</p>
              <p className="font-semibold mt-1">${p.price}</p>
              <p className="text-sm text-gray-500">Stock: {p.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
