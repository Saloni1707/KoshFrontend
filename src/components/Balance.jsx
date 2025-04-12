export const Balance = ({value}) => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold text-gray-700">Your Balance</h2>
                <p className="text-sm text-gray-500">Current available balance</p>
            </div>
            <div className="text-2xl font-bold text-indigo-600">
                ₹{value}
            </div>
        </div>
    );
};