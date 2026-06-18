import {
  Home,
  Library,
  Settings,
  Stethoscope,
  EggFriedIcon,
  Siren,
  User,
  LogOut,
  ChevronDown,
  Heart,
  Calendar,
  CalendarDays,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo/image.png";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const links = [
  { id: "home", label: "Home", to: "/", Icon: Home },
  { id: "doctors", label: "Doctors", to: "/doctors", Icon: Stethoscope },
  { id: "library", label: "Library", to: "/library", Icon: Library },
  { id: "community", label: "Community", to: "/community", Icon: EggFriedIcon },
] as const;

function Navbar() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // جلب بيانات المستخدم من localStorage (لو موجودة)
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;
  const userName = user?.fullName || user?.name || "User";
  const userEmail = user?.email || "user@example.com";

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    toast.success("Logged out successfully!");
    navigate("/login");
    setIsProfileOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsProfileOpen(false);
  };

  const handleEmergency = () => {
    toast.success(
      "Emergency services contacted! Stay calm, help is on the way.",
    );
    // يمكن إضافة منطق الاتصال برقم الطوارئ هنا
  };

  return (
    <header className="border-b border-slate-200/90 bg-white shadow-sm/5 sticky top-0 z-40">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 p-5">
        <Link
          to="/"
          aria-label="MINDECHO — Home"
          className="group flex shrink-0 items-center gap-3.5 rounded-xl outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-blue-500/45 focus-visible:ring-offset-2 active:scale-[0.99]"
        >
          <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-1 shadow-md shadow-slate-900/10 ring-1 ring-slate-200/90 transition-[box-shadow,transform] duration-300 group-hover:shadow-lg group-hover:shadow-blue-600/12 group-hover:ring-blue-200/70 sm:size-14 sm:rounded-[1.05rem]">
            <img
              src={logoImage}
              alt=""
              width={112}
              height={112}
              decoding="async"
              className="h-full w-full object-contain object-center"
            />
          </span>
          <span className="text-xl font-bold tracking-tight text-blue-600 sm:text-2xl">
            MINDECHO
          </span>
        </Link>

        <nav
          className="order-last flex w-full min-w-0 justify-center md:order-none md:flex-1 md:justify-center"
          aria-label="Main navigation"
        >
          <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl bg-slate-100/90 p-1.5 ring-1 ring-slate-200/80 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {links.map((link) => {
              const Icon = link.Icon;
              return (
                <NavLink
                  key={link.id}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    isActive
                      ? "flex shrink-0 items-center gap-2 rounded-xl bg-blue-600/10 px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-blue-600/15 backdrop-blur-sm transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/45 focus-visible:ring-offset-2"
                      : "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 outline-none hover:bg-white/80 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500/35 focus-visible:ring-offset-2"
                  }
                >
                  <Icon
                    className="size-4 shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                  {link.label}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleEmergency}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/25 outline-none transition-all duration-200 hover:from-red-700 hover:to-rose-700 hover:shadow-lg hover:shadow-red-600/35 focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <Siren className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
            Emergency
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="group relative flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/45 focus-visible:ring-offset-2"
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full">
                <img
                  src="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png"
                  alt="Profile"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <ChevronDown
                className={`size-3.5 mr-2 text-gray-500 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/90 overflow-hidden">
                  {/* User Info */}
                  <div className="border-b border-slate-100 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                        <span className="text-lg font-bold text-white">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {userName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={handleProfile}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-all hover:bg-slate-100"
                    >
                      <User className="size-4 text-slate-500" />
                      <span className="font-medium">My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/journal");
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-all hover:bg-slate-100"
                    >
                      <Calendar className="size-4 text-slate-500" />
                      <span className="font-medium">My Journal</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/library");
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-all hover:bg-slate-100"
                    >
                      <Heart className="size-4 text-slate-500" />
                      <span className="font-medium">My Library</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/my-bookings");
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-all hover:bg-slate-100"
                    >
                      <CalendarDays className="size-4 text-slate-500" />
                      <span className="font-medium">My Appointments</span>
                    </button>

                    <div className="my-2 h-px bg-slate-100"></div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition-all hover:bg-red-50"
                    >
                      <LogOut className="size-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
