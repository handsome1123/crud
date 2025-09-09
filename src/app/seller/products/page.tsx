"use client"; // for Next.js 13 app directory

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  sellerId?: {
    _id: string;
    name: string;
    email?: string;
  };
}


export default function SellerProductsPage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Optional: if user is a seller, include token
        const token = localStorage.getItem("token"); // store token after login

        const res = await fetch("/api/seller/products", {
          method: "GET",
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}, // no auth header for buyers
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to fetch products");
          setProducts([]);
        } else {
          setProducts(data.products || []);
        }
      } catch {
        setError("Something went wrong");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;


  return (
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="border p-4 rounded shadow hover:shadow-md"
        >
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded"
            />
          )}
          <h3 className="font-bold">{product.name}</h3>
          <p>{product.description}</p>
          <p className="font-semibold mt-1">${product.price}</p>
          <p className="text-sm text-gray-500">
            Stock: {product.stock} | Seller: {product.sellerId?.name}
          </p>
        </div>
      ))}
    </div>
  );
}
