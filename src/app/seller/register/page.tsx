"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerRegister() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const register = async () => {
    const res = await fetch("/api/seller/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.token) 
      localStorage.setItem("token", data.token);
      alert("Registered successfully!");
      router.push("/seller/login"); // redirect after registration
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Seller Register</h1>
      <input placeholder="Name" className="border p-2 w-full mb-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" className="border p-2 w-full mb-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" className="border p-2 w-full mb-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button onClick={register} className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
    </div>
  );
}
