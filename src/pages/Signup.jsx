import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heading } from "@/components/heading";
import { SubHeading } from "@/components/SubHeading";
import { InputBox } from "@/components/InputBox";
import { Button } from "@/components/Button";
import { BottomWarning } from "@/components/BottomWarnings";
import axios from "axios";

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

  // Check password strength as user types
  useEffect(() => {
    const password = formData.password;
    const reqs = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    
    // Calculate score based on met requirements
    const score = Object.values(reqs).filter(Boolean).length;
    
    setPasswordStrength({
      score,
      requirements: reqs
    });
  }, [formData.password]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate firstname
    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    // Validate lastname
    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Validate password
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
    // Clear error when user starts typing
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
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/api/v1/user/signup",
        formData
      );
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.data?.message === "Email already taken") {
        setErrors(prev => ({
          ...prev,
          username: "Username is already taken"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          submit: "Failed to create account. Please try again."
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Get color for password strength indicator
  const getStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-200";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex justify-center items-center p-4">
      <div className="flex flex-col justify-center w-full max-w-md">
        <div className="rounded-xl bg-white shadow-xl w-full text-center p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-indigo-600">KoshPay</h1>
            <p className="text-gray-500 mt-1">Create your account</p>
          </div>

          <Heading label={"Sign Up"} />
          <SubHeading label={"Enter your information to create an account"} />

          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <InputBox
                  value={formData.firstname}
                  onChange={handleChange("firstname")}
                  placeholder="John"
                  label={"First Name"}
                  error={errors.firstname}
                />
              </div>
              <div className="flex-1">
                <InputBox
                  value={formData.lastname}
                  onChange={handleChange("lastname")}
                  placeholder="Doe"
                  label={"Last Name"}
                  error={errors.lastname}
                />
              </div>
            </div>

            <div className="relative">
              <InputBox
                value={formData.username}
                onChange={handleChange("username")}
                placeholder="Choose a username"
                label={"Username"}
                error={errors.username}
              />
              <div className="absolute right-3 top-[38px] text-xs text-gray-500">
                {formData.username.length}/3 min
              </div>
            </div>

            <div>
              <InputBox
                value={formData.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
                label={"Password"}
                type="password"
                error={errors.password}
              />
              
              {/* Password strength indicator */}
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-left space-y-1">
                  <p className="text-sm font-medium text-gray-700">Password requirements:</p>
                  <ul className="text-xs space-y-1">
                    <li className={passwordStrength.requirements.length ? "text-green-600" : "text-gray-500"}>
                      ✓ At least 6 characters
                    </li>
                    <li className={passwordStrength.requirements.uppercase ? "text-green-600" : "text-gray-500"}>
                      ✓ At least one uppercase letter
                    </li>
                    <li className={passwordStrength.requirements.lowercase ? "text-green-600" : "text-gray-500"}>
                      ✓ At least one lowercase letter
                    </li>
                    <li className={passwordStrength.requirements.number ? "text-green-600" : "text-gray-500"}>
                      ✓ At least one number
                    </li>
                    <li className={passwordStrength.requirements.special ? "text-green-600" : "text-gray-500"}>
                      ✓ At least one special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {errors.submit}
            </div>
          )}

          <div className="mt-8">
            <Button 
              onClick={handleSubmit}
              label={loading ? "Creating Account..." : "Create Account"}
              disabled={loading || passwordStrength.score < 3}
            />
            <div className="mt-4 text-center">
              <BottomWarning
                label={"Already have an account?"}
                buttonText={"Sign in"}
                to={"/signin"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};