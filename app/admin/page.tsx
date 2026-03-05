import StatCard from "@/components/admin/StatCard";
import RecentBookings from "@/components/admin/RecentBookings";
import PageHeader from "@/components/admin/PageHeader";

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your TripBuddy platform"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="1,245" />
        <StatCard title="Total Trips" value="87" />
        <StatCard title="Total Bookings" value="3,421" />
        <StatCard title="Revenue" value="₹12,45,000" />
      </div>

      <div className="bg-white rounded-2xl border p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Revenue Overview
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed rounded-lg">
          Chart will go here
        </div>
      </div>

      <RecentBookings />
    </div>
  );
}