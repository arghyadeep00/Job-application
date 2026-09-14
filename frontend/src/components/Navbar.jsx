import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { UserPen, Settings, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="relative z-10 flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur shadow">
      <h1 className="text-2xl font-bold text-purple-600">
        <Link to="/">job-app</Link>
      </h1>

      {!isAuthenticated ? (
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 border rounded hover:text-purple-700"
          >
            Applicant Login
          </Link>
          <Link
            to="/admin/login"
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Admin Login
          </Link>
        </div>
      ) : (
        <div ref={dropdownRef} className="relative">
          
          <img
            src={user?.avatar?.url || "/user.png"}
            alt="profile"
            className="rounded-full w-10 h-10 cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          />

          {open && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow z-50">
              {user?.role === "user" ? (
                <Link
                  to="/user/dashboard"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-purple-50"
                >
                  <span className="flex items-center gap-3">
                    <UserPen size={18} /> Dashboard
                  </span>
                </Link>
              ) : (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-md text-gray-700 hover:bg-purple-50"
                >
                  <span className="flex items-center gap-3">
                    <UserPen size={18} /> Dashboard
                  </span>
                </Link>
              )}

              <button
                onClick={(e) => {
                  setOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-md cursor-pointer text-red-600 hover:bg-red-50"
              >
                <span className="flex items-center gap-3">
                  <LogOut size={18} /> Logout
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
