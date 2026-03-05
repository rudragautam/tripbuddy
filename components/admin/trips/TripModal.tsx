interface Props {
  onClose: () => void;
}

export default function TripModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">
          Add Trip
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Trip Title"
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Location"
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />

          <select className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option>Select Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}