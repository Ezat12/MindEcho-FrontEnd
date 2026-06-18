// components/Doctor-card/DoctorCard.tsx
import { CalendarDays, Heart, Star, Users } from "lucide-react";
import type { IDoctor } from "../../types/IDoctor";

type DoctorCardProps = {
  doctor: IDoctor;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBook?: () => void;
  onViewProfile?: () => void;
};

function DoctorCard({
  doctor,
  isFavorite,
  onToggleFavorite,
  onBook,
  onViewProfile,
}: DoctorCardProps) {
  // ✅ Get initials for fallback with safety check
  const getInitials = (name: string | undefined) => {
    if (!name) return "DR";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get gender text
  const getGenderText = (gender: number) => {
    return gender === 1 ? "Male" : "Female";
  };

  // ✅ Default values if data is missing
  const fullName = doctor.fullName || "Doctor";
  const specialization = doctor.specialization || "General Doctor";
  const age = doctor.age || 0;
  const gender = doctor.gender ?? 0;
  const bio = doctor.bio || "";
  const email = doctor.email || "";
  const profilePicture = doctor.profilePicture || null;

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-blue-600/10 via-sky-500/10 to-emerald-500/10" />

      <div className="relative flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {/* Profile Picture with fallback */}
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={fullName}
                className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-slate-200"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}

            {/* Always show initials as fallback */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 ring-1 ring-slate-200">
              <span className="text-lg font-bold text-white">
                {getInitials(fullName)}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-base font-bold text-slate-900">
                  {fullName}
                </h3>
              </div>
              <p className="truncate text-sm font-semibold text-blue-700/90">
                {specialization}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                {age > 0 && <span>{age} years</span>}
                <span>{getGenderText(gender)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl bg-white/80 text-slate-700 ring-1 ring-slate-200/80 backdrop-blur transition hover:bg-slate-50"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            onClick={onToggleFavorite}
          >
            <Heart
              className={
                isFavorite ? "size-4 text-rose-600" : "size-4 text-slate-500"
              }
              fill={isFavorite ? "currentColor" : "none"}
              strokeWidth={2}
              aria-hidden
            />
          </button>
        </div>

        {/* Bio section */}
        {bio && (
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 mt-4">
            {bio}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/80">
            {specialization}
          </span>
          {email && (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80">
              {email.split("@")[0]}
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200/80">
            <Star className="size-4 text-amber-500" aria-hidden />
            <span className="font-semibold text-slate-900">
              {doctor.rating || 4.5}
            </span>
            <span className="text-slate-500">
              ({doctor.ratingCount || 0} reviews)
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200/80">
            <Users className="size-4 text-slate-500" aria-hidden />
            <span className="truncate">Arabic, English</span>
          </div>

          <div className="col-span-2 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200/80">
            <div className="flex min-w-0 items-center gap-2">
              <CalendarDays className="size-4 text-slate-500" aria-hidden />
              <span className="truncate">
                {doctor.sessionTime
                  ? `${doctor.sessionTime} min session`
                  : "Available for booking"}
              </span>
            </div>
            <span className="shrink-0 font-bold text-slate-900">
              {doctor.price ? `${doctor.price} EGP` : "Book now"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2"
            onClick={onBook}
          >
            Book Appointment
          </button>
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35 focus-visible:ring-offset-2"
            onClick={onViewProfile}
          >
            View Profile
          </button>
        </div>
      </div>
    </article>
  );
}

export default DoctorCard;
