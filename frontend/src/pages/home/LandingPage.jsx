import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-purple-50 via-white to-indigo-50 roboto">
      {/* Background Blobs */}
      <div className="absolute -top-30px -left-30px w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-30px left-[30%] w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute right-[10%] right-40px  w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>

      <div className="absolute bottom-[20%] -left-10px w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative text-center py-24 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Start Your Career with{" "}
          <span className="text-purple-600">job-app</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto borel">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus
          aspernatur libero veniam illum aperiam enim tenetur dolorum ipsum
          dolor sit amet.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link
            to="/applicant-register"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg text-lg hover:bg-purple-700 transition"
          >
            Apply for Internship
          </Link>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="relative z-10 py-10 px-8">
        <h3 className="text-3xl font-bold text-center mb-14 text-gray-800 roboto">
          Why Join job-app?
        </h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Real-World Projects",
              desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia perferendis impedit repellat?",
            },
            {
              title: "Mentorship",
              desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia perferendis impedit repellat?",
            },
            {
              title: "Career Growth",
              desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia perferendis impedit repellat?",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 bg-white/90 backdrop-blur rounded-md text-center primary-shadow secondary-shadow transition"
            >
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-600 tomorrow">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internship Roles */}
      <section className="relative z-10 py-20 px-8">
        <h3 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Internship Roles Available
        </h3>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {[
            "Web Development",
            "Backend Development",
            "UI/UX Design",
            "Data Analytics",
            "Machine Learning",
          ].map((role) => (
            <span
              key={role}
              className="px-5 py-2 bg-white/90 backdrop-blur border rounded-full text-gray-700 primary-shadow"
            >
              {role}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur text-center py-6 border-t">
        <p className="text-gray-500">
          © {new Date().getFullYear()} job-app. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
