"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AddProductResponse =
  | { error: string }
  | {
      _id: string;
      name: string;
      price: number;
      description: string;
      imageUrl?: string;
      user: string;
    };

export default function AddProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Preview image before upload
  function handleImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError("Please sign in first");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("name", name);
    formData.set("price", price.toString());
    formData.set("description", description);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // do NOT set Content-Type
        },
        body: formData,
      });

      let data: AddProductResponse;
      try {
        data = await res.json();
      } catch {
        data = { error: "Invalid server response" };
      }

      if (res.ok) {
        router.push("/"); // redirect to home page
      } else {
        setError("error" in data ? data.error : "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      <form onSubmit={handleAdd} encType="multipart/form-data" className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input type="file" name="image" accept="image/*" onChange={handleImagePreview} />

        {imagePreview && (
          <div className="relative w-full h-64 rounded overflow-hidden">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover rounded"
            />
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
}
