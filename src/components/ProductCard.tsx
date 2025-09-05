"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  product: { 
    _id: string; 
    name: string; 
    description: string; 
    price: number; 
    imageUrl: string; 
  };
}

export default function ProductCard({ product }: Props) {
  const router = useRouter();

  function handleClick() {
    router.push(`/product/${product._id}`);
  }

  return (
    <div
      onClick={handleClick}
      className="border p-4 rounded shadow hover:shadow-lg cursor-pointer transition"
    >
      <div className="relative w-full h-48 bg-gray-200">
        <Image
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-contain rounded"
          sizes="100vw"
        />
      </div>
      <h2 className="font-bold mt-2">{product.name}</h2>
      <p className="text-gray-600 line-clamp-2">{product.description}</p>
      <p className="text-green-600 font-semibold">${product.price}</p>
    </div>
  );
}
