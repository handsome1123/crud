import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center">
      <div className="max-w-4xl mx-auto py-12">
        <div className="flex justify-center gap-4 mb-12">
          <Link 
            href="/login"
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Buyer
          </Link>

          <Link 
            href="/seller/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Seller
          </Link>

        </div>
        
      </div>
    </div>
  );
}