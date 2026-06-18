import React, { useState, useEffect } from "react";
import { Activity, LogOut, Loader2, Trash2, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getDoctorSchedules,
  addDoctorSchedule,
  deleteDoctorSchedule,
} from "../api/doctorService";
import { toast } from "react-hot-toast";

const DAYS_OF_WEEK = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

interface ScheduleItem {
  id?: number;
  Id?: number;
  dayName?: string;
  dayOfWeek?: number;
  startTime?: string;
  StartTime?: string;
  endTime?: string;
  EndTime?: string;
}

export default function Schedule() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const formatTime = (timeStr: string | undefined) => {
    if (!timeStr || timeStr === "00:00:00" || timeStr === "00:00")
      return "--:--";
    return timeStr.slice(0, 5);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      let doctorId = localStorage.getItem("doctorId");
      if (!doctorId) {
        const userStr = localStorage.getItem("userData");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          doctorId =
            userObj.id || userObj.Id || userObj.doctorId || userObj.DoctorId;
        }
      }
      if (!doctorId) return;
      const res = await getDoctorSchedules(doctorId);
      const data = res?.$values || (Array.isArray(res) ? res : res?.data || []);
      setSchedules(data as ScheduleItem[]);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (startTime >= endTime) {
      toast.error("Start time must be before end time");
      return;
    }
    try {
      await addDoctorSchedule({
        DayOfWeek: Number(dayOfWeek),
        StartTime: startTime,
        EndTime: endTime,
        IsActive: true,
      });
      toast.success("Added successfully");
      loadData();
    } catch {
      toast.error("Error adding slot");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete?")) return;
    try {
      await deleteDoctorSchedule(id);
      toast.success("Deleted");
      loadData();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="sticky top-0 bg-white border-b border-gray-100 px-8 py-4 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/doctor-dashboard")}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight">MindEcho</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/doctor-dashboard")}
              className="font-semibold text-gray-500 hover:text-blue-600"
            >
              Overview
            </button>
            <button
              onClick={() => navigate("/doctor-bookings")}
              className="font-semibold text-gray-500 hover:text-blue-600"
            >
              Bookings
            </button>
            <button className="font-semibold text-blue-600 border-b-2 border-blue-600">
              Schedule
            </button>
            <button onClick={logout} className="text-red-500">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-8">
        <h1 className="text-2xl font-black mb-6">Weekly Schedule</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border shadow-sm h-fit">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CalendarDays size={18} /> New Slot
            </h3>
            <div className="space-y-4">
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 rounded-xl border"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl border"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl border"
              />
              <button
                onClick={handleAdd}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
              >
                Add Slot
              </button>
            </div>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border shadow-sm">
            {loading ? (
              <div className="flex justify-center p-10">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-3">
                {schedules.map((item) => (
                  <div
                    key={item.id || item.Id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border"
                  >
                    <div>
                      <p className="font-bold">
                        {item.dayName ||
                          DAYS_OF_WEEK[item.dayOfWeek ?? 0]?.name}
                      </p>
                      <p className="text-blue-600 text-sm">
                        {formatTime(item.startTime || item.StartTime)} -{" "}
                        {formatTime(item.endTime || item.EndTime)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id || item.Id || 0)}
                      className="text-red-400 p-2 hover:bg-red-50 rounded-lg"
                      aria-label="Delete schedule"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
