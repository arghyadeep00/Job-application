import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Briefcase, 
  Users, 
  Clock, 
  Building2, 
  Code2, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  FileCheck2,
  CalendarCheck2
} from "lucide-react";

const LandingPage = () => {
  const stats = [
    { label: "Active Job Openings", value: "250+", icon: <Briefcase size={20} className="text-purple-600" /> },
    { label: "Candidate Placements", value: "1,200+", icon: <Users size={20} className="text-indigo-600" /> },
    { label: "Hiring Partners", value: "85+", icon: <Building2 size={20} className="text-pink-600" /> },
    { label: "Average Review Time", value: "48h", icon: <Clock size={20} className="text-emerald-600" /> },
  ];

  const steps = [
    {
      step: "01",
      title: "Build Your Candidate Profile",
      desc: "Upload your resume, showcase your education, skills, and projects in a comprehensive portfolio.",
      icon: <FileCheck2 size={28} className="text-purple-600" />
    },
    {
      step: "02",
      title: "Discover & Apply Instantly",
      desc: "Browse curated technical roles, filter by department or seniority, and submit applications with a single click.",
      icon: <Briefcase size={28} className="text-indigo-600" />
    },
    {
      step: "03",
      title: "Interview & Track Status",
      desc: "Receive real-time email updates, review scheduled interviews with Google Meet links, and accept offers.",
      icon: <CalendarCheck2 size={28} className="text-pink-600" />
    }
  ];

  const benefits = [
    {
      icon: <Code2 size={24} className="text-purple-600" />,
      title: "Vetted High-Impact Roles",
      desc: "Gain hands-on experience building scalable applications, AI systems, and modern digital products."
    },
    {
      icon: <TrendingUp size={24} className="text-indigo-600" />,
      title: "Accelerated Career Trajectory",
      desc: "Fast-track your path from internship to full-time engineering and product roles with dedicated mentorship."
    },
    {
      icon: <ShieldCheck size={24} className="text-emerald-600" />,
      title: "Transparent Recruitment",
      desc: "Zero guessing games. Know exactly where your application stands at each milestone from review to offer."
    }
  ];

  const roles = [
    "Full Stack Development",
    "Frontend Engineering (React)",
    "Backend Architecture (Node.js)",
    "UI/UX Product Design",
    "AI & Machine Learning",
    "Data Science & Analytics",
    "DevOps & Cloud Engineering"
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden">
      {/* Ambient Gradient Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-200/60 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-80 -right-40 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-40 left-1/3 w-96 h-96 bg-pink-100/60 rounded-full blur-3xl pointer-events-none"></div>

      {/* Global Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
          Launch Your Tech Career With{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-indigo-600 to-purple-700">
            Job-app
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Connect directly with top engineering teams. Submit your profile, track real-time hiring progress, and land high-impact internships and full-time roles.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/applicant-register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Apply for Internship
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base border border-slate-200 hover:border-slate-300 shadow-2xs hover:-translate-y-0.5 transition-all"
          >
            Explore Open Roles
          </Link>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto text-left">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  {stat.icon}
                </div>
                {/* <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span> */}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stat.value}</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-100">
            Hiring Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            How job-app Works
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            From application to your first day, our structured process makes landing your role smooth and transparent.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div
              key={item.step}
              className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-xs hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-3xl font-extrabold text-slate-200 font-mono">
                  {item.step}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles & Domain Pills */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-linear-to-b from-white to-purple-50/40 rounded-3xl border border-slate-100 my-10 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Available Internship Roles
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Explore diverse technical tracks designed to nurture your strengths.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {roles.map((role) => (
            <div
              key={role}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200/80 rounded-full text-sm font-semibold text-slate-700 shadow-2xs hover:border-purple-300 hover:text-purple-700 hover:shadow-sm transition cursor-default"
            >
              <CheckCircle size={15} className="text-purple-600" />
              {role}
            </div>
          ))}
        </div>
      </section>

      {/* Why Join Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-100">
            Why Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Why Build Your Career with job-app?
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            We bridge the gap between ambitious students and dynamic teams.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="p-8 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
                {b.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{b.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-Footer Call to Action Banner */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="bg-linear-to-r from-purple-700 via-indigo-700 to-purple-800 rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl shadow-purple-600/15 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
            Ready to Take the Next Step in Your Career?
          </h2>
          <p className="text-purple-100 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Join hundreds of successful candidates who started their professional journey with job-app.
          </p>

          <Link
            to="/applicant-register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-purple-700 font-bold text-base hover:bg-purple-50 shadow-md hover:-translate-y-0.5 transition-all"
          >
            Get Started Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-slate-100 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
                <Briefcase size={16} />
              </div>
              <span className="text-lg font-bold text-slate-800">
                job<span className="text-purple-600">-app</span>
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium">
              <Link to="/applicant-register" className="hover:text-purple-600 transition">Apply</Link>
              <Link to="/login" className="hover:text-purple-600 transition">Candidate Login</Link>
              <Link to="/admin/login" className="hover:text-purple-600 transition">Admin Portal</Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} job-app Recruitment System. All rights reserved.</p>
            <p>Built for modern hiring & career tracking.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
