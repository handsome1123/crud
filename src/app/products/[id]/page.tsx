"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");
        
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          setProduct(data);
        } else {
          setError(data.error || "Failed to load product");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product); // ✅ Only pass the product, not quantity
      setAddedToCart(true);
      
      // Reset the "added" state after 2 seconds
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <h2 className="font-bold mb-2">Error Loading Product</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/products" 
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/products" className="text-yellow-600 hover:text-yellow-700">
            ← Back to Products
          </Link>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Product Image */}
            <div className="lg:w-1/2">
              <div className="relative h-96 lg:h-full min-h-[400px]">
                <Image
                  src={product.imageUrl || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="max-w-lg">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  {product.name}
                </h1>
                
                <div className="mb-6">
                  <span className="text-3xl lg:text-4xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || "No description available for this product."}
                  </p>
                </div>

                {/* Product Features/Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Features</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                      High quality materials
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                      Fast shipping available
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                      30-day return policy
                    </li>
                  </ul>
                </div>

                {/* Add to Cart Button */}
                <div className="space-y-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-200 ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {addedToCart ? '✅ Added to Cart!' : '🛒 Add to Cart'}
                  </button>

                  {addedToCart && (
                    <p className="text-center text-green-600 text-sm">
                      Product successfully added to your cart!
                    </p>
                  )}
                </div>

                {/* Additional Actions */}
                <div className="mt-6 flex space-x-4">
                  <button className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    ❤️ Add to Wishlist
                  </button>
                  <button className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    📤 Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section (placeholder) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You might also like</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Related products coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}