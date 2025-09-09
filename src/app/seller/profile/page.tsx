"use client";
import { useState, useEffect } from "react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "buyer" | "seller" | "admin";
}

export default function SellerProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/seller/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setProfile);
  }, []);

  const updateProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/seller/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!data.error) alert("Profile updated successfully!");
  };

  return (
    <div>
    {profile && (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
        <input
          className="border p-2 w-full mb-2"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Name"
        />
        <input
          className="border p-2 w-full mb-2 bg-gray-100"
          value={profile.email}
          disabled
          placeholder="Email"
        />
        <button
          onClick={updateProfile}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    )};
    </div>
  );
}
