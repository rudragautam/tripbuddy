export default function RecentBookings() {
  const bookings = [
    { id: "1", user: "Rahul", trip: "Goa Escape", amount: "₹12,000", status: "Confirmed" },
    { id: "2", user: "Anita", trip: "Himalaya Trek", amount: "₹18,500", status: "Pending" },
    { id: "3", user: "John", trip: "Dubai Tour", amount: "₹45,000", status: "Confirmed" },
  ];

  return (
    <div className="bg-white rounded-2xl border p-6 mt-8">
      <h3 className="text-lg font-semibold mb-6">Recent Bookings</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">User</th>
              <th className="pb-3">Trip</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b last:border-none">
                <td className="py-4">{booking.user}</td>
                <td>{booking.trip}</td>
                <td>{booking.amount}</td>
                <td>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}