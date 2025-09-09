"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/seller/login"); // redirect if not logged in
    else setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
        <nav className="flex-1 space-y-2">
          <button onClick={() => router.push("/seller/dashboard")} className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700">Home</button>
          <button onClick={() => router.push("/seller/profile")} className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700">Profile</button>
          <button onClick={() => router.push("/seller/products")} className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700">Products</button>
          <button onClick={() => router.push("/seller/orders")} className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700">Orders</button>
          <button onClick={() => router.push("/seller/settings")} className="block w-full text-left px-2 py-1 rounded hover:bg-gray-700">Bank Info</button>
        </nav>
        <button onClick={logout} className="mt-auto bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
