"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SigninPage() {
  const router = useRouter(); // ✅ moved inside the component
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  async function handleSignin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem("token", data.token); // store token
        router.push("/"); // redirect to home page
      } else {
        setError(data.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <form onSubmit={handleSignin} className="space-y-4 mt-4">
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">
          Sign In
        </button>
      </form>
      {token && (
        <p className="mt-4 p-2 bg-gray-100 border break-all">Token: {token}</p>
      )}
    </div>
  );
}
