"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { isLoggedIn, logout, user } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="bg-yellow-500 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-lg">
        <Link href="/">MFU SecondHand</Link>
      </div>

      <div className="space-x-4">
        <Link href="/products">Products</Link>
        {isLoggedIn ? (
          <>
            <span>Hi, {user?.email}</span>
            <Link href="/cart">
              Cart {totalItems > 0 && <span>({totalItems})</span>}
            </Link>
            <Link href="/orders">My Orders</Link>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
