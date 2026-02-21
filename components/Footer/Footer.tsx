import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">TripBuddy</h2>
          <p className="mt-4 text-sm text-gray-400">
            Curated travel experiences crafted for explorers who seek
            something beyond the ordinary.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/destinations">Destinations</Link></li>
            <li><Link href="/packages">Packages</Link></li>
            <li><Link href="/experiences">Experiences</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* CTA */}
        <div>
          <h4 className="text-white font-semibold mb-4">Plan Your Journey</h4>
          <p className="text-sm text-gray-400">
            Start building your perfect travel experience today.
          </p>
          <button className="mt-4 bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-full text-white text-sm">
            Get Started
          </button>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} TripBuddy. All rights reserved.
      </div>
    </footer>
  );
}