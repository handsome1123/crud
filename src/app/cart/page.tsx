"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          Your Cart is Empty 🛒
        </h1>
        <Link
          href="/products"
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart 🛒</h1>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 border-b pb-4"
          >
            {/* Product Image */}
            <div className="relative w-24 h-24">
              <Image
                src={item.imageUrl || "/placeholder.png"}
                alt={item.name}
                fill
                className="object-cover rounded-md"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">${item.price}</p>
            </div>

            {/* Quantity Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item._id, Math.max(1, item.quantity - 1))
                }
                className="px-3 py-1 bg-gray-200 rounded-lg"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded-lg"
              >
                +
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeFromCart(item._id)}
              className="ml-4 text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Cart Summary */}
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
          <div className="flex gap-3">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Clear Cart
            </button>
            <Link
              href="/checkout"
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
