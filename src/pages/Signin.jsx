import { BottomWarning } from "@/components/BottomWarnings";
import { SubHeading } from "@/components/SubHeading";
import { Heading } from "@/components/heading";
import { InputBox } from "@/components/InputBox";
import { Button } from "@/components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async () => {
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);
      await login(username.trim(), password);
    } catch (error) {
      console.error("Signin error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      alert(error.response?.data?.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen flex justify-center items-center p-4">
      <div className="flex flex-col justify-center w-full max-w-md">
        <div className="rounded-xl bg-white shadow-xl w-full text-center p-8">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-indigo-600">EasyPay</h1>
            <p className="text-gray-500 mt-2">Fast, secure, and easy payments</p>
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
              disabled={loading}
            />
            <InputBox 
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="••••••••"
              label={"Password"}
              type="password"
              disabled={loading}
            />
          </div>

          <div className="mt-6">
            <Button
              onClick={handleSignIn}
              label={loading ? "Signing in..." : "Sign In"}
              disabled={loading}
            />
          </div>

          <BottomWarning 
            label={"Don't have an account?"} 
            buttonText={"Sign Up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};