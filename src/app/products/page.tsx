"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (res.ok) {
          setProducts(data);
        } else {
          setError(data.error || "Failed to fetch products");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center p-6">Loading products...</p>;
  if (error) return <p className="text-center text-red-500 p-6">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-yellow-600">
        🛒 Products
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col"
          >
            <Link href={`/products/${product._id}`} className="block relative w-full h-48 mb-4">
              <Image
                src={product.imageUrl || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </Link>

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600 flex-grow line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between mt-4">
              <span className="text-lg font-bold text-green-600">
                ${product.price}
              </span>
              <Link
                href={`/products/${product._id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
