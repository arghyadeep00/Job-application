import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import {
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.firstname
    ? `${user?.firstname} ${user?.lastname || ""}`.trim()
    : user?.name || "User";

  return (
    <nav className="relative z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="lg:mx-15 md:mx-4 sm:mx-5">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Briefcase size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-800 flex items-center">
                Job<span className="text-purple-600">-app</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 ml-0.5"></span>
              </span>
            </div>
          </Link>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/applicant-register"
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-purple-600 transition"
                >
                  Apply for Jobs
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-purple-600 border border-slate-200 hover:border-purple-300 rounded-xl transition shadow-2xs"
                >
                  Applicant Login
                </Link>
                <Link
                  to="/admin/login"
                  className="px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-sm shadow-purple-500/20 hover:shadow-md transition"
                >
                  Admin Portal
                </Link>
              </div>
            ) : (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
                >
                  <img
                    src={user?.avatar?.url || "/user.png"}
                    alt="profile"
                    className="rounded-full w-9 h-9 object-cover ring-2 ring-purple-500/20"
                  />
                  <span className="text-sm font-semibold text-slate-700 hidden sm:inline-block max-w-30 truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {/* User Mini Profile Header */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                        {user?.role === "admin"
                          ? "Administrator"
                          : "Job Applicant"}
                      </span>
                    </div>

                    <div className="py-1">
                      {user?.role === "user" ? (
                        <>
                          <Link
                            to="/user/dashboard"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50/80 hover:text-purple-700 transition"
                          >
                            <LayoutDashboard
                              size={17}
                              className="text-slate-400"
                            />
                            Dashboard
                          </Link>
                          <Link
                            to="/user/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50/80 hover:text-purple-700 transition"
                          >
                            <User size={17} className="text-slate-400" />
                            My Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50/80 hover:text-purple-700 transition"
                          >
                            <LayoutDashboard
                              size={17}
                              className="text-slate-400"
                            />
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50/80 hover:text-purple-700 transition"
                          >
                            <User size={17} className="text-slate-400" />
                            Admin Profile
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut size={17} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <img
                src={user?.avatar?.url || "/user.png"}
                alt="profile"
                className="rounded-full w-8 h-8 object-cover ring-2 ring-purple-500/20"
                onClick={() =>
                  navigate(
                    user?.role === "admin"
                      ? "/admin/dashboard"
                      : "/user/dashboard",
                  )
                }
              />
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link
                to="/applicant-register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-purple-600 bg-purple-50 rounded-xl"
              >
                Apply for Internship
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl"
              >
                Applicant Login
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl shadow-xs"
              >
                Admin Portal
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-2 py-2 border-b border-slate-100 mb-2">
                <p className="font-bold text-slate-800">{displayName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <Link
                to={
                  user?.role === "admin"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
                }
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-purple-50 rounded-lg"
              >
                Dashboard
              </Link>
              <Link
                to={user?.role === "admin" ? "/admin/profile" : "/user/profile"}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-purple-50 rounded-lg"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
