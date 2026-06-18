import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import DoctorsList from "../../components/Doctors-list/DoctorsList";
import { useNavigate } from "react-router-dom";
import type { IDoctor } from "../../types/IDoctor";
import { useEffect, useState } from "react";
import { DoctorsData } from "../../data/doctors";
import toast from "react-hot-toast";

function Doctors() {
  const [allDoctors, setAllDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError("");

      try {
        const doctors = await DoctorsData();
        setAllDoctors(doctors);
      } catch (error: any) {
        console.error("Error fetching doctors:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to fetch doctors";
        setError(errorMessage);
        toast.error(errorMessage);

        // if (error.response?.status === 401) {
        //   localStorage.removeItem("token");
        //   navigate("/login");
        // }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [navigate]);

  const handleViewProfile = (doctor: IDoctor) => {
    navigate(`/doctors/${doctor.id}`, { state: { doctor } });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading doctors...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
          {allDoctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No doctors found</p>
            </div>
          ) : (
            <DoctorsList
              doctors={allDoctors}
              onViewProfile={handleViewProfile}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Doctors;
