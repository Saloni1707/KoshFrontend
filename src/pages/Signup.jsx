import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heading } from "@/components/heading";
import { SubHeading } from "@/components/SubHeading";
import { InputBox } from "@/components/InputBox";
import { Button } from "@/components/Button";
import { BottomWarning } from "@/components/BottomWarnings";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

export const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });
  const navigate = useNavigate();
  const { signup, login } = useAuth();

  useEffect(() => {
    const password = formData.password;
    const reqs = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    
    const score = Object.values(reqs).filter(Boolean).length;
    
    setPasswordStrength({
      score,
      requirements: reqs
    });
  }, [formData.password]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (passwordStrength.score < 3) {
      newErrors.password = "Please create a stronger password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
    setErrors({});
  
    try {
      await signup(formData);
    } catch (error) {
      console.error("Signup error:", error);
      localStorage.removeItem("token"); // Clean up in case of error
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
      case 3:
        return "bg-yellow-500";
      case 4:
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-300";
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
          
          <Heading label={"Create an Account"}/>
          <SubHeading label={"Enter your details to get started"}/>
          
          <div className="mt-6 space-y-4">
            <InputBox 
              value={formData.firstname}
              onChange={handleChange("firstname")}
              placeholder="Enter your first name"
              label={"First Name"}
              disabled={loading}
            />
            <InputBox 
              value={formData.lastname}
              onChange={handleChange("lastname")}
              placeholder="Enter your last name"
              label={"Last Name"}
              disabled={loading}
            />
            <InputBox 
              value={formData.username}
              onChange={handleChange("username")}
              placeholder="Choose a username"
              label={"Username"}
              disabled={loading}
            />
            <InputBox 
              value={formData.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              label={"Password"}
              type="password"
              disabled={loading}
            />
          </div>

          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              label={loading ? "Creating Account..." : "Sign Up"}
              disabled={loading || passwordStrength.score < 3}
            />
          </div>

          <BottomWarning 
            label={"Already have an account?"} 
            buttonText={"Sign In"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};