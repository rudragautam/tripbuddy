export default function UserFilters() {
  return (
    <div className="bg-white p-4 rounded-2xl border mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full md:w-1/3 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="user">User</option>
      </select>
    </div>
  );
}