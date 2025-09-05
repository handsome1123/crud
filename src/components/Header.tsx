import Link from "next/link";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="flex justify-between p-4 bg-gray-100">
      <Link href="/">🏪 Marketplace</Link>
      <nav className="flex gap-4">
        <Link href="/products">Products</Link>

        {user ? (
          <>
            <Link href="/account">Account</Link>
            {user.role === "seller" && <Link href="/seller/dashboard">Seller</Link>}
            {user.role === "admin" && <Link href="/admin">Admin</Link>}
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
