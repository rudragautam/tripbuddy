export default function TripTable() {
  const trips = [
    {
      id: 1,
      title: "Goa Beach Escape",
      location: "Goa, India",
      price: "₹12,000",
      status: "Active",
    },
    {
      id: 2,
      title: "Himalayan Adventure",
      location: "Manali, India",
      price: "₹18,500",
      status: "Inactive",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Title</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id} className="border-b last:border-none">
                <td className="py-4 font-medium">{trip.title}</td>
                <td>{trip.location}</td>
                <td>{trip.price}</td>
                <td>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      trip.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {trip.status}
                  </span>
                </td>
                <td className="text-right space-x-3">
                  <button className="text-blue-600 hover:underline text-sm">
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline text-sm">
                    Delete
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