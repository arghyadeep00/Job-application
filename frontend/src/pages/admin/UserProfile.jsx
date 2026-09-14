import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { useEffect, useState } from "react";
import {
  Eye,
  FileText,
  User,
  Brain,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/fetch-user/${id}`);
      setUserData(response.data.resultData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const user = userData;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Back navigation */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to List
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading candidate dossier...</p>
          </div>
        ) : !user ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600 font-medium">Candidate profile not found</p>
          </div>
        ) : (
          <>
            {/* Header Identity Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="avatar"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-xs">
                    {(user?.firstname?.[0] || "U") + (user?.lastname?.[0] || "")}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {[user?.firstname, user?.middlename, user?.lastname].filter(Boolean).join(" ")}
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {user?.domain || "Candidate"}
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {user?.email}
                </p>

                {/* Verification badges */}
                <div className="flex flex-wrap gap-2.5 mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200/80">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Role: {user?.role?.toUpperCase() || "APPLICANT"}
                  </span>

                  {user?.isEmailVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Email Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
                      <XCircle className="w-3.5 h-3.5 text-amber-600" />
                      Email Unverified
                    </span>
                  )}

                  {user?.isPhoneVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Phone Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                      Phone Unverified
                    </span>
                  )}
                </div>
              </div>

              {/* Quick action: Resume */}
              {user?.resume?.url && (
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `https://docs.google.com/gview?url=${user.resume.url}&embedded=true`,
                      "_blank"
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> View Resume
                </button>
              )}
            </div>

            {/* Grid for Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Personal Information</h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-slate-400" /> Email
                    </span>
                    <span className="font-semibold text-slate-900">{user?.email || "-"}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400" /> Phone
                    </span>
                    <span className="font-semibold text-slate-900">
                      {user?.phone?.countryCode || ""} {user?.phone?.phoneNumber || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Gender</span>
                    <span className="font-semibold text-slate-900 capitalize">
                      {user?.gender || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" /> Location
                    </span>
                    <span className="font-semibold text-slate-900">{user?.location || "-"}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" /> Date of Birth
                    </span>
                    <span className="font-semibold text-slate-900">
                      {user?.dob
                        ? new Date(user.dob).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills & Experience */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                      <Brain className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Key Skills</h3>
                  </div>

                  {user?.skills ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.split(",").map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No skills specified</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">Work Experience</h3>
                  </div>

                  {user?.experience ? (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                      <p className="text-sm font-bold text-slate-900">
                        {user?.experience?.companyName || "Organization"}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {user?.experience?.year || 0} Years total experience
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No experience details recorded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Education History */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Education History</h3>
              </div>

              {user?.education && user?.education?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.education.map((edu, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">{edu?.level}</h4>
                        {edu?.percentage && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                            {edu.percentage}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-700">{edu?.institution}</p>
                      <p className="text-xs text-slate-500">{edu?.board}</p>
                      {(edu?.startDate || edu?.endDate) && (
                        <p className="text-xs text-slate-400">
                          {edu?.startDate ? new Date(edu.startDate).getFullYear() : ""} –{" "}
                          {edu?.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No education details recorded.</p>
              )}
            </div>

            {/* Documents / Resume Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Curriculum Vitae / Resume</h4>
                  <p className="text-xs text-slate-500">Candidate's uploaded application resume</p>
                </div>
              </div>

              {user?.resume?.url ? (
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      `https://docs.google.com/gview?url=${user.resume.url}&embedded=true`,
                      "_blank"
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> Open Resume Document
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </button>
              ) : (
                <span className="text-xs font-medium text-rose-500">No resume uploaded</span>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;

