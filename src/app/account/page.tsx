export default function AccountPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Account</h1>
      <ul className="mt-4">
        <li><a href="/account/orders" className="text-blue-600">My Orders</a></li>
        <li><a href="/account/settings" className="text-blue-600">Settings</a></li>
      </ul>
    </div>
  );
}
