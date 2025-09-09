"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

// Separate component for the checkout content
function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams?.get("productId") || "";
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch product details (client-side only)
  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setError("No product selected");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/buyer/products/${productId}`);
        const data: { success?: boolean; products?: Product[]; error?: string; product?: Product } = await res.json();

        if (res.ok && data.product) {
          setProduct(data.product);
        } else if (res.ok && data.products && data.products.length > 0) {
          setProduct(data.products[0]);
        } else {
          setError(data.error || "Failed to fetch product");
        }
      } catch {
        setError("Something went wrong while fetching the product.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  // Handle order submission
  const handleCheckout = async () => {
    if (!product) return;
    setSubmitting(true);

    try {
      // Check if we're in the browser before accessing localStorage
      if (typeof window === 'undefined') {
        setError("Please reload the page and try again.");
        setSubmitting(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to checkout.");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/buyer/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        router.push(`/buyer/orders`);
      } else {
        setError(data.error || "Checkout failed.");
      }
    } catch {
      setError("Something went wrong during checkout.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (error) return <p className="text-center text-red-500 p-6">{error}</p>;
  if (!product) return <p className="text-center p-6">Product not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-8">
      {/* Product Image */}
      <div className="relative w-full md:w-1/2 h-96 md:h-[500px] rounded-lg overflow-hidden">
        <Image
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Checkout Details */}
      <div className="md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <span className="text-2xl font-bold text-green-600">${product.price * quantity}</span>

          {/* Quantity selector */}
          <div className="mt-4">
            <label className="mr-2 font-semibold">Quantity:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
            />
          </div>
        </div>

        {/* Checkout button */}
        <div className="mt-6">
          <button
            onClick={handleCheckout}
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

// Force dynamic rendering to prevent build-time prerendering
export const dynamic = 'force-dynamic';