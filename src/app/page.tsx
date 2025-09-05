"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ImageCarousel from '@/components/ImageCarousel';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Banner Images
  const bannerImages = [
    '/banner/1.jpg',
    '/banner/2.jpg',
    '/banner/3.jpg',
    '/banner/4.jpg',
  ];

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await fetch("/api/products");
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch products`);
        }
        
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
        setError(errorMessage);
        setProducts([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <main className="p-6">
        <div className="mb-6">
          <ImageCarousel images={bannerImages} />
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="mb-6">
          <ImageCarousel images={bannerImages} />
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
            <h2 className="font-bold mb-2">Error Loading Products</h2>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      {/* Banner Section */}
      <div className="mb-8">
        <ImageCarousel images={bannerImages} />
      </div>

      {/* Featured Products Section */}
      <section className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h1>
          <p className="text-gray-600">Discover our amazing collection of products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg 
                  className="w-16 h-16 mx-auto mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m6-7v2m4-2v2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No products available</h3>
              <p className="text-gray-500">Check back later for new products!</p>
            </div>
          )}
        </div>
      </section>

      {/* Additional sections can be added here */}
      {/* {products.length > 0 && (
        <section className="text-center mt-12 py-8 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Start Shopping Today!</h2>
          <p className="text-gray-600 mb-4">Browse our full collection and find what you love</p>
          <a 
            href="/products" 
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            View All Products
          </a>
        </section>
      )} */}
    </main>
  );
}