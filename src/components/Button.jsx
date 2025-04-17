export function Button({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full text-white bg-indigo-600 hover:bg-indigo-700 
        focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 
        font-medium rounded-lg text-base px-6 py-3.5 
        active:transform active:scale-[0.98] transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-sm hover:shadow-md"
    >
      {label}
    </button>
  );
}