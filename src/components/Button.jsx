export function Button({ label, onClick }) {
    return (
      <button
        onClick={onClick}
        type="button"
        className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
      >
        {label}
      </button>
    );
  }