interface Props {
  onView: () => void;
}

export default function BookingTable({ onView }: Props) {
  const bookings = [
    {
      id: 1,
      user: "Rahul Sharma",
      trip: "Goa Beach Escape",
      amount: "₹12,000",
      status: "Confirmed",
      date: "12 Feb 2026",
    },
    {
      id: 2,
      user: "Anita Roy",
      trip: "Himalayan Adventure",
      amount: "₹18,500",
      status: "Pending",
      date: "14 Feb 2026",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">User</th>
              <th className="pb-3">Trip</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b last:border-none">
                <td className="py-4 font-medium">
                  {booking.user}
                </td>
                <td>{booking.trip}</td>
                <td>{booking.amount}</td>
                <td>{booking.date}</td>
                <td>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="text-right space-x-3">
                  <button
                    onClick={onView}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>
                  <button className="text-red-600 hover:underline text-sm">
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}