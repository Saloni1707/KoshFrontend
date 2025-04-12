import {Link} from "react-router-dom";

export function BottomWarning({label , buttonText , to}){
    return(
        <div className="text-sm text-gray-600">
            <span>{label}</span>
            <Link className="text-indigo-600 hover:text-indigo-800 font-medium ml-1" to={to}>
                {buttonText}
            </Link>
        </div>
    );
}