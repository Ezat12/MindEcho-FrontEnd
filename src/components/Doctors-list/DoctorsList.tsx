import { useState } from "react";
import { Search, Star } from "lucide-react";
import DoctorCard from "./DoctorCard";
import type { IDoctor } from "../../types/IDoctor";

type SortKey = "recommended" | "rating_desc" | "reviews_desc" | "price_asc";

type DoctorsListProps = {
  doctors: IDoctor[];
  onBook?: (doctor: IDoctor) => void;
  onViewProfile?: (doctor: IDoctor) => void;
};

function clampRating(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(5, value));
}

function DoctorsList({ doctors, onBook, onViewProfile }: DoctorsListProps) {
  // Extract unique specializations for filter
  const specialties = (() => {
    const set = new Set<string>();
    doctors.forEach((d) => {
      if (d.specialization) set.add(d.specialization);
    });
    return [
      "All specialties",
      ...Array.from(set).sort((a, b) => a.localeCompare(b)),
    ];
  })();

  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState(
    specialties[0] ?? "All specialties",
  );
  const [minRating, setMinRating] = useState<number>(0);
  const [sortKey, setSortKey] = useState<SortKey>("recommended");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const q = query.trim().toLowerCase();
  const min = clampRating(minRating);

  const filtered = doctors.filter((d) => {
    const matchesQuery =
      q.length === 0 ||
      d.fullName?.toLowerCase().includes(q) ||
      d.specialization?.toLowerCase().includes(q) ||
      (d.bio && d.bio.toLowerCase().includes(q));

    const matchesSpecialty =
      specialty === "All specialties" ? true : d.specialization === specialty;

    // Note: rating doesn't exist in IDoctor, so we'll use a default or calculate
    // For now, we'll skip rating filter or add a placeholder
    const matchesRating = true; // d.rating >= min; // rating not available

    return matchesQuery && matchesSpecialty && matchesRating;
  });

  // Sort logic (adjusted for available fields)
  filtered.sort((a, b) => {
    switch (sortKey) {
      case "rating_desc":
        // rating not available, sort by name instead
        return a.fullName.localeCompare(b.fullName);
      case "reviews_desc":
        // ratingCount not available
        return a.fullName.localeCompare(b.fullName);
      case "price_asc":
        // priceEGP not available
        return a.fullName.localeCompare(b.fullName);
      case "recommended":
      default:
        // Sort by name as default
        return a.fullName.localeCompare(b.fullName);
    }
  });

  return (
    <section className="flex flex-col gap-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <label className="text-sm font-semibold text-slate-900">
              Search doctors
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/80 focus-within:ring-2 focus-within:ring-blue-500/35">
              <Search className="size-4 shrink-0 text-slate-500" aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, specialty, issue (anxiety, sleep...)"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[520px]">
            <div>
              <label className="text-sm font-semibold text-slate-900">
                Specialty
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="mt-2 w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/80 outline-none focus:ring-2 focus:ring-blue-500/35"
              >
                {specialties.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900">
                Sort
              </label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="mt-2 w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-900 ring-1 ring-slate-200/80 outline-none focus:ring-2 focus:ring-blue-500/35"
              >
                <option value="recommended">Recommended</option>
                <option value="rating_desc">Highest rated</option>
                <option value="reviews_desc">Most reviewed</option>
                <option value="price_asc">Lowest price</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quick filters
            </span>
            <div className="flex flex-wrap gap-2">
              {/* Tags removed since not in IDoctor - can add common specializations instead */}
              <button
                type="button"
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80 transition hover:bg-slate-200"
              >
                Coming soon
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <label className="text-sm font-semibold text-slate-900">
              Min rating
            </label>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200/80">
              <Star className="size-4 text-amber-500" aria-hidden />
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-40 accent-blue-600"
                disabled
              />
              <span className="w-10 text-right text-sm font-semibold text-slate-800">
                {minRating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-slate-400">(Coming soon)</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-semibold text-slate-900">
            {filtered.length}
          </span>{" "}
          doctors
        </p>
        <button
          type="button"
          className="text-sm font-semibold text-blue-700 transition hover:text-blue-800"
          onClick={() => {
            setQuery("");
            setSpecialty("All specialties");
            setMinRating(0);
            setSortKey("recommended");
          }}
        >
          Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            isFavorite={Boolean(favorites[doctor.id])}
            onToggleFavorite={() =>
              setFavorites((prev) => ({
                ...prev,
                [doctor.id]: !prev[doctor.id],
              }))
            }
            onBook={onBook ? () => onBook(doctor) : undefined}
            onViewProfile={
              onViewProfile ? () => onViewProfile(doctor) : undefined
            }
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-base font-bold text-slate-900">No results</p>
          <p className="mt-1 text-sm text-slate-600">
            Try a different search or reset filters.
          </p>
        </div>
      ) : null}
    </section>
  );
}

export default DoctorsList;
