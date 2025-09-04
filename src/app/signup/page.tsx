"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/signin");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 animate-gradient-x flex items-center justify-center p-4">

    <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in">

      {/* Left Image */}
      <div className="md:w-1/2 relative h-48 md:h-auto">
        <Image
          src="/mfu.jpg"
          alt="Campus"
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Right Form */}
      <div className="w-full md:w-1/2 flex flex-col p-8">
        {/* Header */}
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-yellow-500">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign up to get started with your MFU portal
          </p>
        </div>

        {/* Separator */}
        <div className="flex items-center my-6">
          <Separator className="flex-1" />
          <span className="px-3 text-xs text-gray-500 uppercase">Or</span>
          <Separator className="flex-1" />
        </div>

      <form onSubmit={handleSignup} className="space-y-4 flex-1">
        <div>
                  <label
          htmlFor="name"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Name
        </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition"
              required
            />
          </div>
        </div>

          {/* Email */}
          <div>
          <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Email
        </label>
            <div className="relative">
              {/* <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /> */}
              <input
                id="email"
                type="email"
                placeholder="Enter your Lamduan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
                      <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Email
        </label>
            <div className="relative">
              {/* <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /> */}
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

        {error && <p className="text-red-500">{error}</p>}
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Sign Up
        </button>

        {/* Footer */}
        <div className="p-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/signin" className="text-yellow-500 hover:underline font-semibold">
            Sign in
          </Link>
        </div>

      </form>



      </div>

    {/* Animation */}
    <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fadeIn 0.8s ease forwards;
      }
    `}</style>

    </div>
    </div>
  );
}
