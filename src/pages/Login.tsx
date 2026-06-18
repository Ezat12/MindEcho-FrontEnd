import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo_image from "../assets/logo/image.png";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/";

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    console.log("Logging in with:", formData, "Role:", role);

    try {
      // استخدام نفس الـ endpoint لجميع المستخدمين
      const endpoint =
        role === "doctor"
          ? `${import.meta.env.VITE_API_URL}/api/Auth/login-doctor`
          : `${import.meta.env.VITE_API_URL}/api/Auth/login-user`;

      const res = await axios.post(
        endpoint,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Login response:", res);

      if (res.data?.success && res.data?.data?.token) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("userRole", role);

        if (res.data.data.user) {
          localStorage.setItem("userData", JSON.stringify(res.data.data.user));
        } else if (res.data.data.doctor) {
          localStorage.setItem(
            "userData",
            JSON.stringify(res.data.data.doctor),
          );
        }

        toast.success(res.data?.message || "Logged in successfully!", {
          duration: 3000,
          position: "top-right",
          icon: "🎉",
        });

        // التوجيه حسب الدور
        if (role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate(from === "/" ? "/home" : from, { replace: true });
        }
      } else {
        throw new Error(res.data?.message || "Login failed");
      }
    } catch (error: any) {
      console.error(
        "Error during login:",
        error.response?.data || error.message,
      );

      let errorMessage = "Invalid email or password. Please try again.";

      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        if (errorData.errors) {
          const errorMessages: string[] = [];
          Object.keys(errorData.errors).forEach((key) => {
            const msgs = errorData.errors[key];
            if (Array.isArray(msgs)) {
              errorMessages.push(...msgs);
            } else if (typeof msgs === "string") {
              errorMessages.push(msgs);
            }
          });
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join(", ");
          }
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-gray-50">
        <div className="md:w-1/2 bg-[#f0f9ff] p-12 flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-8">
            <img
              src={logo_image}
              alt="Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h2 className="text-3xl font-black text-[#1e293b] mb-4">
            Welcome Back!
          </h2>
          <p className="text-[#64748b] font-medium leading-relaxed">
            We're glad to see you again. Continue your journey towards mental
            clarity.
          </p>
        </div>

        <div className="md:w-1/2 p-12 lg:p-16">
          <h3 className="text-2xl font-black text-[#1e293b] mb-8">Login</h3>

          {/* Role Selector */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setRole("patient");
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                role === "patient"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("doctor");
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                role === "doctor"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Doctor
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-lg">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={login}>
            <div>
              <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest ml-1 mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-[#f1f5f9] rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                placeholder={
                  role === "doctor"
                    ? "doctor@example.com"
                    : "patient@example.com"
                }
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest ml-1 block">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-bold text-blue-500 hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                className="w-full bg-[#f1f5f9] rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1 transition-all mt-4 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                `Sign In as ${role === "doctor" ? "Doctor" : "Patient"}`
              )}
            </button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-[#94a3b8]">
              New to MindEcho?{" "}
              <Link
                to={role === "doctor" ? "/register-doctor" : "/signup"}
                className="text-[#2563eb] hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
