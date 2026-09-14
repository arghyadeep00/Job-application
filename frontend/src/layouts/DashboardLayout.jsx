import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="h-16 bg-white/80 backdrop-blur shadow sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white shadow-lg hidden md:block overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main Content - Scrollable */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
