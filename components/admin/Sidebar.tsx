"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin" },
  { name: "Users", path: "/admin/users" },
  { name: "Trips", path: "/admin/trips" },
  { name: "Bookings", path: "/admin/bookings" },
  { name: "Reports", path: "/admin/reports" },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white border-r transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-5 border-b">
        {!collapsed && (
          <span className="text-xl font-semibold tracking-tight">
            TripBuddy
          </span>
        )}
        <button onClick={() => setCollapsed(!collapsed)}>
          <Menu size={20} />
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
              pathname === item.path
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {collapsed ? item.name.charAt(0) : item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}