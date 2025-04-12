import { useEffect,useState } from "react";
import axios from "axios";
import { Button } from "./Button.jsx";
import {Link , useNavigate } from "react-router-dom";

export const Appbar = () => {
    const [user ,setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(()=> {
        const userToken = localStorage.getItem("token");

        //here we chk if the user exists in local storage
        if(!userToken){
            navigate("/signin");
        }else{
            axios.get(import.meta.env.VITE_SERVER_URL + "/api/v1/user/getUser", {
                headers: {
                    Authorization : "Bearer " + userToken,
                },
            })
            .then((response) => {
                setUser(response.data);
            });
        }
    },[]);

    const signOutHandler = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    return (
        <div className="shadow h-14 flex justify-between items-center md:px-10">
            <Link to={"/dashboard"}>
               <div className="flex flex-col justify-center h-full ml-4 font-bold">
                PayTM App
               </div>
            </Link>
            <div className="flex items-center justify-center gap-2">
                <Button label={"SignOut"} onClick={signOutHandler}/>
                <div className="flex flex-col justify-center h-full text-xl">
                    {user?.firstname}
                </div>
                <div className="rounded-full h-10 w-10 p-4 bg-slate-200 flex justify-center mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user?.firstname?.[0]?.toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    )
}