"use client";

import Image from "next/image";

interface Props {
  product: { _id: string; name: string; price: number; imageUrl: string };
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="border p-4 rounded">
      <div className="relative w-full h-48">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <h2 className="font-bold mt-2">{product.name}</h2>
      <p className="text-green-600 font-semibold">${product.price}</p>
    </div>
  );
}

