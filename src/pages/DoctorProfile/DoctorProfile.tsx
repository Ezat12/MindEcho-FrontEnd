// pages/DoctorProfile/DoctorProfile.tsx
import { Link, useParams, useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import DoctorProfileDetails from "../../components/Doctor-profile/DoctorProfileDetails";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosConfig";
import toast from "react-hot-toast";
import type { IDoctor, ISlot } from "../../types/IDoctor";

function DoctorProfile() {
  const { doctorId } = useParams();
  const location = useLocation();
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [slots, setSlots] = useState<ISlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  // ✅ دالة جلب الـ slots من الباك
  const fetchDoctorSlots = async (id: string) => {
    try {
      setLoadingSlots(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        return;
      }

      console.log("🟡 Fetching slots for doctor ID:", id);

      const res = await axiosInstance.get(`/DoctorSchedule/slots`, {
        params: {
          DoctorId: id,
        },
      });

      console.log("🟢 Slots API response:", res.data);

      if (res.data?.success && res.data?.data) {
        setSlots(res.data.data);
        console.log("Slots loaded:", res.data.data.length);
      } else {
        setSlots([]);
      }
    } catch (error: any) {
      console.error("Error fetching slots:", error);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      // ✅ جلب الدكتور من الـ state لو موجود
      const doctorFromState = location.state?.doctor as IDoctor;

      if (doctorFromState && doctorFromState.id === doctorId) {
        console.log("Using doctor from state");
        setDoctor(doctorFromState);
        setLoading(false);
        // ✅ جلب الـ slots للدكتور
        await fetchDoctorSlots(doctorId!);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view doctor profile");
          setLoading(false);
          return;
        }

        console.log("Fetching doctor from API...");

        // ✅ جلب بيانات الدكتور
        const res = await axiosInstance.get(`/Doctor/profile`, {
          params: {
            id: doctorId,
          },
        });

        console.log("Doctor API Response:", res.data);

        if (res.data?.success && res.data?.data) {
          const doctorData = res.data.data;

          const doctorWithDefaults: IDoctor = {
            id: doctorData.id,
            fullName: doctorData.fullName || "Doctor",
            email: doctorData.email || "",
            gender: doctorData.gender ?? 0,
            age: doctorData.age ?? 0,
            specialization: doctorData.specialization || "General Doctor",
            sessionTime: doctorData.sessionTime || 45,
            price: doctorData.price || 250,
            bio: doctorData.bio || "",
            profilePicture: doctorData.profilePicture || null,
            avgResponseTime: "Within 24 hours",
            experience: 8,
            patientsHelped: 1200,
            rating: 4.5,
            ratingCount: 150,
          };

          setDoctor(doctorWithDefaults);

          // ✅ جلب الـ slots للدكتور
          await fetchDoctorSlots(doctorId!);
        } else {
          setError(res.data?.message || "Failed to load doctor data");
        }
      } catch (error: any) {
        console.error("Error fetching doctor:", error);

        if (error.response?.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("token");
        } else if (error.response?.status === 404) {
          setError("Doctor not found");
        } else {
          setError(
            error.response?.data?.message || "Failed to load doctor profile",
          );
        }

        toast.error(error.response?.data?.message || "Failed to load doctor");
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    } else {
      setError("No doctor ID provided");
      setLoading(false);
    }
  }, [doctorId, location.state]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading doctor profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/doctors"
              className="inline-flex text-sm font-semibold text-blue-700 transition hover:text-blue-800"
            >
              ← Back to doctors
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Doctor not found</p>
            <Link
              to="/doctors"
              className="inline-flex text-sm font-semibold text-blue-700 transition hover:text-blue-800"
            >
              ← Back to doctors
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
          <Link
            to="/doctors"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
          >
            ← Back to doctors
          </Link>
          <DoctorProfileDetails
            doctor={doctor}
            slots={slots}
            loadingSlots={loadingSlots}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DoctorProfile;
