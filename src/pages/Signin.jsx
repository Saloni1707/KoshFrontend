import { BottomWarning } from "@/components/BottomWarnings";
import { SubHeading } from "@/components/SubHeading";
import { Heading } from "@/components/heading";
import { InputBox } from "@/components/InputBox";
import { Button } from "@/components/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Signin = () => {
  const[username , setUsername] = useState("");
  const [password , setPassword] = useState("");
  const navigate = useNavigate();

  useEffect( () => {
    const userToken = localStorage.getItem("token");
    //check if the token exists in the local storage
    if(!userToken){
      navigate("/signin");
    }else{
      //Fetch balance if token exists
      axios
        .get(import.meta.env.VITE_SERVER_URL + "/api/v1/account/balance",{
          headers:{
            Authorization:"Bearer " + userToken,
          },
        })
        .then((response) => {
          setBal(response.data.balance);
        })
        .catch((error) =>{
          navigate("/signin");
        });
    }
  },[]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex justify-center items-center p-4">
      <div className="flex flex-col justify-center w-full max-w-md">
        <div className="rounded-xl bg-white shadow-xl w-full text-center p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-indigo-600">KoshPay</h1>
            <p className="text-gray-500 mt-1">Your trusted payment partner</p>
          </div>
          
          <Heading label={"Welcome Back"}/>
          <SubHeading label={"Enter your credentials to access your account"}/>
          
          <div className="mt-6 space-y-4">
            <InputBox 
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Enter your username"
              label={"Username"}
            />
            <InputBox 
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="••••••••"
              label={"Password"}
              type="password"
            />
          </div>
          
          <div className="mt-8">
            <Button 
              onClick = {async () => {
                try {
                  const response = await axios.post(
                    import.meta.env.VITE_SERVER_URL + "/api/v1/user/signin",
                    {
                      username,
                      password
                    }
                  );
                  localStorage.setItem("token",response.data.token);
                  navigate("/dashboard");
                } catch (error) {
                  console.error("Signin error:", error);
                  alert("Signin failed. Please check your credentials.");
                }
              }}
              label = {"Sign In"}
            />
            <div className="mt-4 text-center">
              <BottomWarning
                label = {"Don't have an account?"}
                buttonText={"Sign up"}
                to={"/signup"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};