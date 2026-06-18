import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Calendar, AlertCircle } from "lucide-react";
import axiosInstance from "../api/axiosConfig";
import toast from "react-hot-toast";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    age: "",
    gender: 1, // 1 = Male, 2 = Female
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string[];
    email?: string[];
    password?: string[];
    age?: string[];
    gender?: string[];
  }>({});
  const [loading, setLoading] = useState(false);

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setFieldErrors({});
    setLoading(true);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      age: parseInt(formData.age) || 0,
      gender: formData.gender,
    };

    console.log("Signing up with:", payload);

    try {
      const res = await axiosInstance.post(`/Auth/register-user`, payload);

      console.log("Sign-up response:", res);

      if (res.data?.success && res.data?.data?.token) {
        toast.success(res.data?.message || "Account created successfully!", {
          duration: 3000,
          position: "top-right",
          icon: "🎉",
        });

        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("userRole", "patient");

        if (res.data.data.user) {
          localStorage.setItem("userData", JSON.stringify(res.data.data.user));
        }

        navigate("/login");
      } else {
        throw new Error(res.data?.message || "Registration failed");
      }
    } catch (error: any) {
      console.error(
        "Error during sign-up:",
        error.response?.data || error.message,
      );

      const errorData = error.response?.data;

      if (errorData?.errors) {
        setFieldErrors(errorData.errors);
        const errorMessages: string[] = [];
        Object.keys(errorData.errors).forEach((key) => {
          const msgs = errorData.errors[key];
          if (Array.isArray(msgs)) {
            errorMessages.push(`${key}: ${msgs.join(", ")}`);
          } else if (typeof msgs === "string") {
            errorMessages.push(`${key}: ${msgs}`);
          }
        });
        setError(errorMessages.join(" | "));
        toast.error("Please check the form for errors");
      } else if (errorData?.message) {
        setError(errorData.message);
        toast.error(errorData.message);
      } else {
        setError("An error occurred during sign-up. Please try again.");
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white text-black flex flex-col justify-center items-center p-4 font-sans"
      dir="ltr"
    >
      <Link
        to="/"
        className="absolute top-6 right-6 flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
      >
        <span>Back to Home</span>
        <span>→</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-gray-200 shadow-md space-y-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center p-2 shadow-sm">
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600">
              <path
                d="M30,50 Q50,20 70,50 T30,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="30" cy="50" r="5" fill="#000" />
              <circle cx="50" cy="23" r="5" fill="#2563eb" />
              <circle cx="70" cy="50" r="5" fill="#000" />
              <path
                d="M40,65 L45,75 L35,80"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />
              <path
                d="M60,65 L55,75 L65,80"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
              />
              <text
                x="50"
                y="95"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="currentColor"
              >
                BATCH 4
              </text>
            </svg>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-black">Patient Sign Up</h1>
            <p className="text-xs text-gray-500">
              Create your personal account to join MindEcho platform.
            </p>
          </div>
        </div>

        {/* Error Summary */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Please fix the following errors:</p>
              <ul className="list-disc list-inside mt-1">
                {Object.entries(fieldErrors).map(([field, messages]) => (
                  <li key={field}>
                    <span className="font-medium">{field}:</span>{" "}
                    {messages?.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={signUp} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-black mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Your Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`w-full bg-white border ${fieldErrors.fullName ? "border-red-500" : "border-gray-300"} rounded-xl pl-10 pr-4 py-3 text-sm text-black focus:outline-none focus:border-blue-600 transition-colors`}
                required
              />
              {fieldErrors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.fullName[0]}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-black mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="patient@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full bg-white border ${fieldErrors.email ? "border-red-500" : "border-gray-300"} rounded-xl pl-10 pr-4 py-3 text-sm text-black focus:outline-none focus:border-blue-600 transition-colors`}
                required
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-black mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full bg-white border ${fieldErrors.password ? "border-red-500" : "border-gray-300"} rounded-xl pl-10 pr-4 py-3 text-sm text-black focus:outline-none focus:border-blue-600 transition-colors`}
                required
              />
              {fieldErrors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.password[0]}
                </p>
              )}
            </div>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-black mb-2">
                Age
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  placeholder="22"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className={`w-full bg-white border ${fieldErrors.age ? "border-red-500" : "border-gray-300"} rounded-xl pl-10 pr-4 py-3 text-sm text-black focus:outline-none focus:border-blue-600 transition-colors`}
                  required
                />
                {fieldErrors.age && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.age[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-black mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: parseInt(e.target.value) })
                }
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-blue-600 transition-colors cursor-pointer"
              >
                <option value={1}>Male</option>
                <option value={2}>Female</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            LogIn Here
          </Link>
        </div>
      </div>
    </div>
  );
}
