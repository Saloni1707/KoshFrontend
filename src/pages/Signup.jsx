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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white text-2xl">✓</span>
          </div>
          <Heading label="Create an Account" />
          <SubHeading label="Enter your details to get started" />
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 border border-gray-200 dark:border-gray-700 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <InputBox
              label="First Name"
              placeholder="John"
              value={formData.firstname}
              onChange={handleChange("firstname")}
            />
            <InputBox
              label="Last Name"
              placeholder="Doe"
              value={formData.lastname}
              onChange={handleChange("lastname")}
            />
          </div>

          <InputBox
            label="Username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange("username")}
          />

          <div>
            <InputBox
              label="Password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
            />
            {/* Password strength indicator */}
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                      level <= passwordStrength.score
                        ? level <= 2
                          ? "bg-red-500"
                          : level <= 3
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Password must contain at least 6 characters, including uppercase, lowercase, number, and special character
              </div>
            </div>
          </div>

          {/* Error messages */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              <ul className="list-disc list-inside space-y-1">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit button */}
          <Button
            label={loading ? "Creating Account..." : "Create Account"}
            onClick={handleSubmit}
            disabled={loading || passwordStrength.score < 3}
          />
        </div>

        {/* Bottom text */}
        <BottomWarning
          label="Already have an account?"
          buttonText="Sign In"
          to="/signin"
        />
      </div>
    </div>
  );
};