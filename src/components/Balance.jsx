export const Balance = ({value}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300">Your Balance</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Current available balance</p>
            </div>
            <div className="w-full sm:w-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-xl px-4 py-3 sm:py-2">
                <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    ₹{value.toLocaleString('en-IN')}
                </div>
            </div>
        </div>
    );
};