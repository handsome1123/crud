"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/buyer/products/${id}`);
        const data = await res.json();
        if (res.ok) setProduct(data);
        else setError(data.error || "Failed to fetch product");
      } catch {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

// async function handleBuyNow(productId: string) {
//   const res = await fetch("/api/buyer/checkout", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ productId, quantity: 1 }),
//   });

//   const data = await res.json();
//   console.log("Checkout Response:", data);
// }

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (error) return <p className="text-center text-red-500 p-6">{error}</p>;
  if (!product) return <p className="text-center p-6">Product not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-8">
      <div className="relative w-full md:w-1/2 h-96 md:h-[500px] rounded-lg overflow-hidden">
        <Image
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <span className="text-2xl font-bold text-green-600">${product.price}</span>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push(`/buyer/checkout?productId=${product._id}`)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Buy Now
          </button>
        </div>

      </div>
    </div>
  );
}
