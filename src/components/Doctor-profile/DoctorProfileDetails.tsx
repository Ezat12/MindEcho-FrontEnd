import {
  CalendarDays,
  Mail,
  Star,
  Users,
  Clock,
  MessageCircle,
  Briefcase,
  Activity,
  DollarSign,
} from "lucide-react";
import type { IDoctor, ISlot } from "../../types/IDoctor";
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosConfig";

type DoctorProfileDetailsProps = {
  doctor: IDoctor;
  slots?: ISlot[];
  loadingSlots?: boolean;
};

function DoctorProfileDetails({
  doctor,
  slots = [],
  loadingSlots = false,
}: DoctorProfileDetailsProps) {
  const [selectedSlot, setSelectedSlot] = useState<ISlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    setIsBooking(true);
    try {
      const formData = new FormData();
      formData.append("DoctorId", doctor.id);
      formData.append("DoctorSessionSlotId", selectedSlot.id.toString());

      const res = await axiosInstance.post(`/Booking/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success("Appointment booked successfully!");
        setSelectedSlot(null);
      } else {
        toast.error(res.data?.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment");
    } finally {
      setIsBooking(false);
    }
  };

  const getGenderText = (gender: number) => {
    return gender === 1 ? "Male" : "Female";
  };

  const getInitials = (name: string) => {
    if (!name) return "DR";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatSlotDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatSlotTimeRange = (startTime: string, endTime: string) => {
    const start = startTime.substring(0, 5);
    const end = endTime.substring(0, 5);
    return `${start} - ${end}`;
  };

  const groupedSlots: { date: string; slots: ISlot[] }[] = [];
  slots.forEach((slot) => {
    if (slot.date) {
      const dateKey = formatSlotDate(slot.date);
      const existingGroup = groupedSlots.find((g) => g.date === dateKey);
      if (existingGroup) {
        existingGroup.slots.push(slot);
      } else {
        groupedSlots.push({ date: dateKey, slots: [slot] });
      }
    }
  });

  const pricePerSession = doctor.price || 250;
  const sessionDuration = doctor.sessionTime || 45;
  const avgResponseTime = doctor.avgResponseTime || "Within 24 hours";
  const experience = doctor.experience || 8;
  const patientsHelped = doctor.patientsHelped || 1200;
  const rating = doctor.rating || 4.5;
  const ratingCount = doctor.ratingCount || 150;

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Left Side */}
      <div className="flex-[2] space-y-5">
        <section className="details rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {doctor.profilePicture ? (
              <img
                src={doctor.profilePicture}
                alt={doctor.fullName}
                className="h-24 w-24 rounded-2xl object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 ring-1 ring-slate-200">
                <span className="text-2xl font-bold text-white">
                  {getInitials(doctor.fullName)}
                </span>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  {doctor.fullName}
                </h1>
              </div>
              <p className="mt-1 text-base font-semibold text-blue-700">
                {doctor.specialization || "General Doctor"}
              </p>

              <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                {doctor.age > 0 && <span>Age: {doctor.age} years</span>}
                <span>Gender: {getGenderText(doctor.gender)}</span>
              </div>

              {doctor.bio && (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {doctor.bio}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200/80">
              <Star className="size-4 text-amber-500" aria-hidden />
              <span className="font-semibold text-slate-900">{rating}</span>
              <span className="text-slate-500">({ratingCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200/80">
              <Users className="size-4 text-slate-500" aria-hidden />
              <span>Arabic, English</span>
            </div>
          </div>

          {doctor.email && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200/80">
              <Mail className="size-4 text-slate-500" aria-hidden />
              <span className="truncate">{doctor.email}</span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/80">
              {doctor.specialization}
            </span>
            {doctor.age > 0 && (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80">
                {doctor.age} years old
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80">
              {getGenderText(doctor.gender)}
            </span>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-4 text-center ring-1 ring-green-100 shadow-sm">
            <Activity className="size-7 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">
              {patientsHelped}+
            </div>
            <div className="text-sm font-semibold text-green-600 mt-1">
              Patients helped
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-sky-50 p-4 text-center ring-1 ring-blue-100 shadow-sm">
            <MessageCircle className="size-7 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-blue-700">
              {avgResponseTime}
            </div>
            <div className="text-sm font-semibold text-blue-600 mt-1">
              Avg response time
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 p-4 text-center ring-1 ring-purple-100 shadow-sm">
            <Briefcase className="size-7 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">
              {experience}+
            </div>
            <div className="text-sm font-semibold text-purple-600 mt-1">
              Years experience
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Booking + Chat */}
      <div className="lg:w-96 space-y-4">
        {/* Booking Section */}
        <section className="schedule rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Book Appointment
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-blue-500" />
                <span className="text-sm text-slate-600">Session duration</span>
              </div>
              <span className="font-semibold text-slate-900">
                {sessionDuration} minutes
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-green-500" />
                <span className="text-sm text-slate-600">
                  Price per session
                </span>
              </div>
              <span className="font-bold text-blue-600 text-lg">
                {pricePerSession} EGP
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mb-4">
            <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <CalendarDays className="size-4 text-blue-500" />
              Available Time Slots
            </h3>

            {loadingSlots ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : groupedSlots.length === 0 ? (
              <div className="text-center py-4">
                <CalendarDays className="size-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">
                  No available slots at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-48 overflow-y-auto">
                {groupedSlots.map((group, idx) => (
                  <div key={idx}>
                    <p className="text-xs font-semibold text-slate-500 mb-2">
                      {group.date}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedSlot?.id === slot.id
                              ? "bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2"
                              : "bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-700 ring-1 ring-slate-200"
                          }`}
                        >
                          {formatSlotTimeRange(slot.startTime, slot.endTime)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedSlot && (
            <div className="mb-4 p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-600 font-semibold mb-1">
                Selected Slot
              </p>
              <p className="text-sm font-medium text-blue-800">
                {formatSlotDate(selectedSlot.date)} •{" "}
                {formatSlotTimeRange(
                  selectedSlot.startTime,
                  selectedSlot.endTime,
                )}
              </p>
            </div>
          )}

          <button
            onClick={handleBookAppointment}
            disabled={!selectedSlot || isBooking}
            className="w-full rounded-xl bg-green-600 px-4 py-3 text-base font-bold text-white shadow-lg shadow-green-600/25 transition hover:bg-green-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBooking ? "Booking..." : `Book Now - ${pricePerSession} EGP`}
          </button>
        </section>

        <p className="text-xs text-slate-400 text-center">
          Free cancellation within 24 hours
        </p>
      </div>
    </div>
  );
}

export default DoctorProfileDetails;
