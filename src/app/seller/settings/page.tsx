"use client";
import { useState, useEffect } from "react";

export default function SellerSettings() {
  const [bank, setBank] = useState({ accountNumber: "", bankName: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/seller/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.bankInfo) setBank(data.bankInfo);
      });
  }, []);

  const updateBank = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/seller/bank", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(bank),
    });
    const data = await res.json();
    if (!data.error) alert("Bank info updated successfully!");
  };

  return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">Bank Settings</h1>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Account Number"
          value={bank.accountNumber}
          onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Bank Name"
          value={bank.bankName}
          onChange={(e) => setBank({ ...bank, bankName: e.target.value })}
        />
        <button
          onClick={updateBank}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
  );
}
