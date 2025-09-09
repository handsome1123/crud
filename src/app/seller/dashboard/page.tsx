"use client";
import { useEffect, useState } from "react";

interface BankInfo {
  bankName: string;
  accountNumber: string;
}

interface SellerProfile {
  name: string;
  email: string;
  isVerified: boolean;
  bankInfo?: BankInfo;
}

export default function SellerHome() {
  const [profile, setProfile] = useState<SellerProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/seller/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: SellerProfile) => setProfile(data))
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, []);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {profile.name}</h1>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Profile Info</h2>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Verified:</strong> {profile.isVerified ? "Yes" : "No"}</p>
        {profile.bankInfo && (
          <>
            <p><strong>Bank Name:</strong> {profile.bankInfo.bankName}</p>
            <p><strong>Account Number:</strong> {profile.bankInfo.accountNumber}</p>
          </>
        )}
      </div>
    </div>
  );
}
