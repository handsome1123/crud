"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  role: "seller" | "buyer" | "admin";
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push(`/${role}/login`);
      return;
    }

    // Verify token with profile API
    fetch(`/${role}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          localStorage.removeItem("token");
          router.push(`/${role}/login`);
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push(`/${role}/login`);
      })
      .finally(() => setLoading(false));
  }, [router, role]);

  if (loading) return <p className="p-6">Checking authentication...</p>;
  if (!authorized) return null;

  return <>{children}</>;
}
