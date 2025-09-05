"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export default function OrderPage() {
  const params = useParams();
  const id = params?.id as string;

  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      if (!token) {
        setError("You must be logged in to view this order.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setOrder(data);
        } else {
          setError(data.error || "Failed to fetch order.");
        }
      } catch {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id, token]);

  if (loading) return <p className="p-6 text-center">Loading order...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
  if (!order) return <p className="p-6 text-center">Order not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
        <p className="mb-2"><strong>Order ID:</strong> {order._id}</p>
        <p className="mb-2"><strong>Status:</strong> {order.status}</p>
        <p className="mb-4"><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>

        <h2 className="text-xl font-semibold mb-2">Customer Info</h2>
        <p>{order.customer.name}</p>
        <p>{order.customer.email}</p>
        <p>{order.customer.phone}</p>
        <p>{order.customer.address}</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Items</h2>
        <ul className="mb-4">
          {order.items.map((item) => (
            <li key={item._id} className="flex justify-between border-b py-2">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <p className="text-right text-2xl font-bold text-green-600">Total: ${order.total.toFixed(2)}</p>
      </div>
    </div>
  );
}
