"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ImageCarousel from '@/components/ImageCarousel'

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [token, setToken] = useState<string | null>(null);

    // Bannner Images
  const bannerImages = [
    '/banner/1.jpg',
    '/banner/2.jpg',
    '/banner/3.jpg',
    '/banner/4.jpg',
  ];

  // Load token on mount
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
  }, []);

  // Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  // Logout handler
  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/signin");
  }

  // Navigate to add product page
  function handleAddProduct() {
    router.push("/add-product");
  }

  // Navigate to login page
  function handleLogin() {
    router.push("/signin");
  }

  // Navigate to signup page
  function handleSignup() {
    router.push("/signup");
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">MFU 2ndHand</h1>

        {token ? (
          <div className="flex gap-2">
            <button
              onClick={handleAddProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleLogin}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Log In
            </button>
            <button
              onClick={handleSignup}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
      <div className="mb-6">
         {/* Image Slider - Banner */}
        <ImageCarousel images={bannerImages} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p._id} product={p} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found.</p>
        )}
      </div>
    </main>
  );
}
