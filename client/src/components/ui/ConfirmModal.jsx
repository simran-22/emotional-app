export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-bold text-charcoal mb-2">{title}</h3>
        <p className="text-charcoal/60 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-charcoal font-semibold
              hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-coral text-white font-semibold
              hover:bg-coral/80 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
