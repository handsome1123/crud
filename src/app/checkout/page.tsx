"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const { cart, clearCart, totalItems } = useCart();
  const { token, user } = useAuth();
  const router = useRouter();

  // Pre-fill name with user's name if available, fallback to email
  // const [name, setName] = useState(user?.name || user?.email || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    
    if (!token) {
      setError("You must be logged in to place an order.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const orderItems = cart.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer: { name, email, phone, address },
          items: orderItems,
          total: totalPrice,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Order placed successfully! Redirecting...");
        clearCart();
        
        // Small delay to show success message before redirect
        setTimeout(() => {
          router.push(`/orders/${data._id}`);
        }, 1500);
      } else {
        setError(data.error || "Failed to place order.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Show empty cart message if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Order Summary - moved to top for better UX */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <div className="space-y-1">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>{totalItems} items total</span>
            <span className="text-green-600">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          {/* <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div> */}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email *
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Delivery Address *
            </label>
            <textarea
              id="address"
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success !== ""}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? "Placing Order..." : `Place Order - $${totalPrice.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}