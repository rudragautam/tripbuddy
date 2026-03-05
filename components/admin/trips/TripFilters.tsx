export default function TripFilters() {
  return (
    <div className="bg-white p-4 rounded-2xl border mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <input
        type="text"
        placeholder="Search trips..."
        className="w-full md:w-1/3 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}