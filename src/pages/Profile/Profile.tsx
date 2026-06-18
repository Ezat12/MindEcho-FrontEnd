// pages/Profile/Profile.tsx
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  User,
  Mail,
  Calendar,
  Heart,
  Edit2,
  Save,
  X,
  Camera,
  Activity,
  Clock,
  Star,
  Shield,
  Sparkles,
  Loader2,
} from "lucide-react";
import axiosInstance from "../../api/axiosConfig";
import toast from "react-hot-toast";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  gender: number;
  age: number;
  profilePicture: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    gender: 0,
    age: 0,
  });

  // جلب بيانات المستخدم من الـ API
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view profile");
        setLoading(false);
        return;
      }

      const res = await axiosInstance.get(`/Client/profile`);

      console.log("Profile response:", res.data);

      // ✅ التحقق من وجود الـ data حتى لو success كان false
      if (res.data?.data && res.data.data.id && res.data.data.id !== "string") {
        const userData = res.data.data;
        setUser({
          id: userData.id,
          fullName: userData.fullName || "User",
          email: userData.email || "",
          gender: userData.gender ?? 0,
          age: userData.age ?? 0,
          profilePicture: userData.profilePicture || null,
        });
        setEditForm({
          fullName: userData.fullName || "",
          gender: userData.gender ?? 0,
          age: userData.age ?? 0,
        });

        // تحديث localStorage بالبيانات
        localStorage.setItem("userData", JSON.stringify(userData));

        // لو success كان false بس فيه data، اعرض رسالة خفيفة
        if (res.data?.success === false) {
          toast.success("Profile loaded successfully!");
        }
      }
      // حاول تجيب من localStorage لو الـ API فشل
      else {
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setEditForm({
            fullName: parsedUser.fullName || "",
            gender: parsedUser.gender ?? 0,
            age: parsedUser.age ?? 0,
          });
        } else {
          toast.error("Failed to load profile");
        }
      }
    } catch (error: unknown) {
      console.error("Error fetching profile:", error);

      // Fallback to localStorage
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setEditForm({
          fullName: parsedUser.fullName || "",
          gender: parsedUser.gender ?? 0,
          age: parsedUser.age ?? 0,
        });
        toast.success("Profile loaded from cache");
      } else {
        toast.error("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to update profile");
        return;
      }

      console.log(editForm);

      console.log("Saving profile with data:", {
        fullName: editForm.fullName,
        email: user?.email,
        gender: editForm.gender,
        age: editForm.age,
      });

      const formData = new FormData();
      formData.append("FullName", editForm.fullName);
      formData.append("Email", user?.email || "");
      formData.append("Gender", editForm.gender.toString());
      formData.append("Age", editForm.age.toString());

      const res = await axiosInstance.post(
        `/Client`,
        {
          FullName: editForm.fullName,
          Email: user?.email,
          Gender: editForm.gender,
          Age: editForm.age,
        },
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      console.log("Update profile response:", res.data);

      // ✅ التحقق من وجود الـ data حتى لو success كان false
      if (res.data?.data) {
        const updatedUserData = res.data.data;
        const updatedUser = {
          id: updatedUserData.id || user?.id,
          fullName: updatedUserData.fullName || editForm.fullName,
          email: updatedUserData.email || user?.email || "",
          gender: updatedUserData.gender ?? editForm.gender,
          age: updatedUserData.age ?? editForm.age,
          profilePicture:
            updatedUserData.profilePicture || user?.profilePicture || null,
        };

        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));

        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else if (res.data?.success === false) {
        // لو الـ API رجع false بس التحديث اتعمل على الـ backend
        // حدث localStorage محلياً
        const updatedUser = {
          ...user,
          fullName: editForm.fullName,
          gender: editForm.gender,
          age: editForm.age,
        };
        setUser(updatedUser as UserProfile);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(res.data?.message || "Failed to update profile");
      }
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: { message?: string; title?: string };
          status?: number;
        };
      };
      console.error("Error updating profile:", error);
      console.error("Error response data:", err.response?.data);
      console.error("Error status:", err.response?.status);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.title ||
          "Failed to update profile",
      );
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const getGenderText = (gender: number) => {
    return gender === 1 ? "Male" : "Female";
  };

  const getInitials = (name: string) => {
    if (!name || name === "string") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="size-12 text-blue-600 mx-auto mb-3 animate-spin" />
            <p className="text-slate-500">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <User className="size-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">User not found</p>
            <button
              onClick={fetchUserProfile}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-5 text-blue-500" />
            <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          </div>
          <p className="text-slate-500 mt-1">
            Manage your personal information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-24"></div>
              <div className="px-6 pb-6 -mt-12">
                <div className="flex justify-center">
                  <div className="relative">
                    {user.profilePicture && user.profilePicture !== "string" ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullName}
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                        <span className="text-3xl font-bold text-white">
                          {getInitials(user.fullName)}
                        </span>
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md hover:bg-slate-100 transition">
                      <Camera className="size-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <h2 className="text-xl font-bold text-slate-800">
                    {user.fullName !== "string" ? user.fullName : "User"}
                  </h2>
                  <p className="text-sm text-slate-500 flex items-center justify-center gap-1 mt-1">
                    <Mail className="size-3" />
                    {user.email !== "string" ? user.email : "user@example.com"}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {user.age} years
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                      {getGenderText(user.gender)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Member since</span>
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Account status</span>
                    <span className="font-medium text-green-600 flex items-center gap-1">
                      <Shield className="size-3" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <User className="size-5 text-blue-600" />
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition"
                  >
                    <Edit2 className="size-3" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          fullName: user.fullName,
                          gender: user.gender,
                          age: user.age,
                        });
                      }}
                      className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                    >
                      <X className="size-4" />
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-1 text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Save className="size-3" />
                      )}
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600 block mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={
                        editForm.fullName === "string" ? "" : editForm.fullName
                      }
                      onChange={(e) =>
                        setEditForm({ ...editForm, fullName: e.target.value })
                      }
                      className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-slate-700 p-3 bg-slate-50 rounded-xl">
                      {user.fullName !== "string" ? user.fullName : "Not set"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-600 block mb-1">
                    Email
                  </label>
                  <p className="text-slate-700 p-3 bg-slate-50 rounded-xl flex items-center gap-2">
                    <Mail className="size-4 text-slate-400" />
                    {user.email !== "string" ? user.email : "Not set"}
                    <span className="text-xs text-green-600 ml-auto">
                      Verified
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-600 block mb-1">
                      Age
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.age}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            age: parseInt(e.target.value) || 0,
                          })
                        }
                        min={1}
                        max={120}
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      />
                    ) : (
                      <p className="text-slate-700 p-3 bg-slate-50 rounded-xl">
                        {user.age} years
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-600 block mb-1">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        value={editForm.gender}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            gender: parseInt(e.target.value),
                          })
                        }
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      >
                        <option value={0}>Female</option>
                        <option value={1}>Male</option>
                      </select>
                    ) : (
                      <p className="text-slate-700 p-3 bg-slate-50 rounded-xl">
                        {getGenderText(user.gender)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mental Health Journey */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <Heart className="size-5 text-rose-500" />
                Mental Health Journey
              </h3>
              <p className="text-slate-500 text-sm">
                Track your progress and growth with MindEcho
              </p>
              <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
                <p className="text-sm text-rose-700">
                  🌟 "Taking care of your mental health is an act of self-love.
                  Keep going!"
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
                <Activity className="size-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">0</p>
                <p className="text-sm text-slate-600">Sessions Completed</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                <Star className="size-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">0</p>
                <p className="text-sm text-slate-600">Journal Entries</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 text-center">
                <Clock className="size-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-700">0</p>
                <p className="text-sm text-slate-600">Days Active</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
