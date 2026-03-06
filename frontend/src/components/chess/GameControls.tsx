// Placeholder for game controls component
export default function GameControls() {
  return (
    <div className="flex gap-2 mt-4">
      <button className="px-4 py-2 bg-primary-600 text-white rounded">
        Reset Game
      </button>
      <button className="px-4 py-2 bg-gray-200 rounded">
        Undo Move
      </button>
    </div>
  )
}
