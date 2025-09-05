"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OrderItem {
  product: { _id: string; name: string; price: number };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchOrders = async () => {
      try {
        console.log("Fetching orders with token:", token ? "exists" : "missing");
        
        const response = await fetch("/api/orders", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Check if response has content
        const contentLength = response.headers.get('content-length');
        if (contentLength === '0') {
          console.warn("Empty response received");
          setOrders([]);
          return;
        }

        // Get response text first to debug
        const responseText = await response.text();
        console.log("Raw response:", responseText);

        // Try to parse JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error("Invalid JSON response from server");
        }

        console.log("Parsed data:", data);
        
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          console.warn("Unexpected data format:", data);
          setOrders([]);
        }

      } catch (error) {
        console.error("Failed to fetch orders:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch orders";
        setError(errorMessage);
        
        // If unauthorized, redirect to signin
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          localStorage.removeItem('token');
          router.push("/signin");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, router]);

  if (loading) return <p className="p-6">Loading...</p>;
  
  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold">Error loading orders:</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (!orders.length) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No orders found.</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="border border-gray-200 p-6 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-lg text-gray-800">Order #{order._id.slice(-8)}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <p className="font-bold text-xl text-gray-800 mt-2">${order.total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-800 mb-3">Order Items ({order.items.length}):</h3>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                    {item.product ? (
                      <>
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">{item.product.name}</span>
                          <span className="text-gray-600 ml-2">× {item.quantity}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                          <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
                        </div>
                      </>
                    ) : (
                      <span className="text-red-500 italic">Product information unavailable</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <button
                onClick={() => router.push(`/orders/${order._id}`)}
                className="text-yellow-600 hover:text-yellow-700 font-medium"
              >
                View Details →
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total</div>
                <div className="font-bold text-lg">${order.total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}