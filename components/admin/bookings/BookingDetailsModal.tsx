interface Props {
  onClose: () => void;
}

export default function BookingDetailsModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">
          Booking Details
        </h3>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>User:</strong> Rahul Sharma</p>
          <p><strong>Trip:</strong> Goa Beach Escape</p>
          <p><strong>Amount:</strong> ₹12,000</p>
          <p><strong>Status:</strong> Confirmed</p>
          <p><strong>Date:</strong> 12 Feb 2026</p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}