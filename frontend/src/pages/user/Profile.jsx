import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Brain,
  GraduationCap,
  FileText,
  SquarePen,
  Eye,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // for open edit forms
  const [editAvatar, setEditAvatar] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [editPersonal, setEditPersonal] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [editEducation, setEducation] = useState(false);
  const [editResume, setResume] = useState(false);

  // for forms
  const [profileForm, setProfileForm] = useState({});
  const [personalForm, setPersonalForm] = useState({});
  const [skillsForm, setSkillsForm] = useState({});
  const [educationForm, setEducationForm] = useState({});

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstname: user.firstname || "",
        middlename: user.middlename || "",
        lastname: user.lastname || "",
      });

      setPersonalForm({
        phone: user.phone || "",
        gender: user.gender || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        location: user.location || "",
      });

      setSkillsForm({
        skills: user.skills || "",
        companyName: user?.experience?.companyName || "",
        year: user?.experience?.year || "",
      });

      setEducationForm(
        user.education || {
          level: "",
          institution: "",
          board: "",
          startDate: "",
          endDate: "",
          percentage: "",
        }
      );
    }
  }, [user]);

  // for profile image
  const [imageFile, setImageFile] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload an image file");
    }

    const imageUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(imageUrl);
  };

  const handleAvatarSave = async () => {
    if (!imageFile) {
      return toast.error("No image selected");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await api.put("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message || "Avatar updated successfully");
      fetchUser();
      setEditAvatar(false);
      setImagePreview(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Profile picture update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // update profile info
  const handleProfileSave = async () => {
    try {
      setLoading(true);
      const res = await api.put("/user/profile", profileForm);
      toast.success(res.data.message || "Profile updated");
      fetchUser();
      setEditProfile(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  // update personal details
  const handlePersonalSave = async () => {
    try {
      setLoading(true);
      const res = await api.put("/user/personal", personalForm);
      toast.success(res.data.message || "Personal details updated");
      fetchUser();
      setEditPersonal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  // update skill & experience
  const handleSkillsSave = async () => {
    try {
      setLoading(true);
      const res = await api.put("/user/skills", skillsForm);
      toast.success(res.data.message || "Skills updated");
      fetchUser();
      setEditSkills(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update skills");
    } finally {
      setLoading(false);
    }
  };

  // update education information
  const handleEducationSave = async () => {
    try {
      setLoading(true);
      const payload = {
        ...educationForm,
        startDate: educationForm.startDate
          ? new Date(educationForm.startDate)
          : null,
        endDate: educationForm.endDate ? new Date(educationForm.endDate) : null,
      };

      const res = await api.put("/user/education", payload);
      toast.success(res.data.message || "Education details updated");
      fetchUser();
      setEducation(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update education");
    } finally {
      setLoading(false);
    }
  };

  // resume update
  const [resumeFile, setResumeFile] = useState(null);
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("application/pdf")) {
      return toast.error("Please upload a PDF document");
    }

    setResumeFile(file);
  };

  const handleResumeSave = async () => {
    if (!resumeFile) {
      return toast.error("Please select a PDF file to upload");
    }

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      setLoading(true);
      const res = await api.patch("/user/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message || "Resume updated successfully");
      fetchUser();
      setResume(false);
      setResumeFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update resume");
    } finally {
      setLoading(false);
    }
  };

  const fullName =
    [user?.firstname, user?.middlename, user?.lastname].filter(Boolean).join(" ") ||
    "Candidate";

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal credentials, experience records, and application documents.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar with hover trigger */}
          <div className="relative group cursor-pointer" onClick={() => setEditAvatar(true)}>
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt="profile"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-xs group-hover:opacity-90 transition-all"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-xs">
                {(user?.firstname?.[0] || "U") + (user?.lastname?.[0] || "")}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
              <Camera className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
              {user?.domain && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {user.domain}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" />
              {user?.email}
            </p>
          </div>

          <button
            onClick={() => setEditProfile(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Personal Details</h3>
              </div>
              <button
                onClick={() => setEditPersonal(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                title="Edit Personal Details"
              >
                <SquarePen className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" /> Phone
                </span>
                <span className="font-medium text-slate-800">
                  {user?.phone?.countryCode || ""} {user?.phone?.phoneNumber || "Not set"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Gender</span>
                <span className="font-medium text-slate-800 capitalize">
                  {user?.gender || "Not set"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" /> Date of Birth
                </span>
                <span className="font-medium text-slate-800">
                  {user?.dob
                    ? new Date(user.dob).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Not set"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" /> Location
                </span>
                <span className="font-medium text-slate-800">{user?.location || "Not set"}</span>
              </div>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Skills</h3>
                </div>
                <button
                  onClick={() => setEditSkills(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                  title="Edit Skills & Experience"
                >
                  <SquarePen className="w-4 h-4" />
                </button>
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
                <p className="text-xs text-slate-400">No skills added yet</p>
              )}
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Work Experience
              </span>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.experience?.companyName || "Fresher / Looking for first role"}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-700">
                  {user?.experience?.year ? `${user.experience.year} yrs` : "0 yrs"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Education History</h3>
            </div>
            <button
              onClick={() => setEducation(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              title="Edit Education"
            >
              <SquarePen className="w-4 h-4" />
            </button>
          </div>

          {user?.education && user?.education?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.education.map((e, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-900 text-sm">{e.level}</p>
                    {e.percentage && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        {e.percentage}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-700">{e.institution}</p>
                  <p className="text-xs text-slate-500">{e.board}</p>
                  {(e?.startDate || e?.endDate) && (
                    <p className="text-xs text-slate-400">
                      {e?.startDate ? new Date(e.startDate).getFullYear() : ""} –{" "}
                      {e?.endDate ? new Date(e.endDate).getFullYear() : "Present"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-sm">
              No education records found. Click edit to add your academic background.
            </div>
          )}
        </div>

        {/* Resume Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Resume / Curriculum Vitae</h4>
              <p className="text-xs text-slate-500">
                PDF version uploaded for employer applications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {user?.resume?.url && (
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `https://docs.google.com/gview?url=${user.resume.url}&embedded=true`,
                    "_blank"
                  )
                }
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-200/60 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                View Resume
                <ExternalLink className="w-3 h-3 text-indigo-400" />
              </button>
            )}

            <button
              onClick={() => setResume(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
            >
              <SquarePen className="w-3.5 h-3.5" />
              {user?.resume?.url ? "Update Resume" : "Upload Resume"}
            </button>
          </div>
        </div>

        {/* EDIT MODAL: Avatar */}
        {editAvatar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setEditAvatar(false)}
            />
            <div className="relative z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="font-bold text-slate-900 text-base">Update Profile Picture</h3>
                <button
                  onClick={() => setEditAvatar(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <label
                htmlFor="imageUpload"
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-2xl border shadow-xs"
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Click to choose image</p>
                    <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
              </label>

              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setEditAvatar(false);
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAvatarSave}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Picture"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL: Profile Name */}
        {editProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setEditProfile(false)}
            />
            <div className="relative z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="font-bold text-slate-900 text-base">Edit Name Credentials</h3>
                <button
                  onClick={() => setEditProfile(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="First Name"
                    value={profileForm.firstname || ""}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, firstname: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Middle Name"
                    value={profileForm.middlename || ""}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, middlename: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Last Name"
                    value={profileForm.lastname || ""}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, lastname: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setEditProfile(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileSave}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL: Personal Details */}
        {editPersonal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setEditPersonal(false)}
            />
            <div className="relative z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="font-bold text-slate-900 text-base">Edit Personal Details</h3>
                <button
                  onClick={() => setEditPersonal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="e.g. 9876543210"
                    value={personalForm.phone || ""}
                    onChange={(e) =>
                      setPersonalForm({ ...personalForm, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={personalForm.gender || ""}
                    onChange={(e) =>
                      setPersonalForm({ ...personalForm, gender: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={personalForm.dob || ""}
                    onChange={(e) =>
                      setPersonalForm({ ...personalForm, dob: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="e.g. Bangalore, India"
                    value={personalForm.location || ""}
                    onChange={(e) =>
                      setPersonalForm({ ...personalForm, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setEditPersonal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePersonalSave}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Details"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL: Skills & Experience */}
        {editSkills && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setEditSkills(false)}
            />
            <div className="relative z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="font-bold text-slate-900 text-base">Edit Skills & Experience</h3>
                <button
                  onClick={() => setEditSkills(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skills (Comma separated)
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="React, TypeScript, CSS"
                    value={skillsForm.skills || ""}
                    onChange={(e) =>
                      setSkillsForm({ ...skillsForm, skills: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="e.g. Acme Corp"
                    value={skillsForm.companyName || ""}
                    onChange={(e) =>
                      setSkillsForm({ ...skillsForm, companyName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="e.g. 3"
                    value={skillsForm.year || ""}
                    onChange={(e) =>
                      setSkillsForm({ ...skillsForm, year: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setEditSkills(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSkillsSave}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Skills"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL: Education */}
        {editEducation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setEducation(false)}
            />
            <div className="relative z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="font-bold text-slate-900 text-base">Edit Education</h3>
                <button
                  onClick={() => setEducation(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree / Level
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={educationForm.level || ""}
                    onChange={(e) =>
                      setEducationForm({ ...educationForm, level: e.target.value })
                    }
                  >
                    <option value="">Select Level</option>
                    <option value="Class X">Class X</option>
                    <option value="Class XII">Class XII</option>
                    <option value="Graduation">Graduation</option>
                    <option value="Post Graduation">Post Graduation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution / University
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Institution / College Name"
                    value={educationForm.institution || ""}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        institution: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Board / Department
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="Board / Department"
                    value={educationForm.board || ""}
                    onChange={(e) =>
                      setEducationForm({ ...educationForm, board: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={educationForm.startDate || ""}
                      onChange={(e) =>
                        setEducationForm({
                          ...educationForm,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      value={educationForm.endDate || ""}
                      onChange={(e) =>
                        setEducationForm({
                          ...educationForm,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Percentage / CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="e.g. 85.5"
                    value={educationForm.percentage || ""}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        percentage: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setEducation(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEducationSave}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Education"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL: Resume Upload */}
        {editResume && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setResume(false)}
            />
            <div className="relative z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="font-bold text-slate-900 text-base">Upload Resume</h3>
                <button
                  onClick={() => setResume(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <label
                htmlFor="resume"
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20"
              >
                {resumeFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{resumeFile.name}</p>
                    <p className="text-xs text-emerald-600 font-medium">Ready to upload</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Click to select PDF document</p>
                    <p className="text-xs text-slate-400">PDF up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  id="resume"
                  hidden
                  accept="application/pdf"
                  onChange={handlePdfChange}
                />
              </label>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setResume(false);
                    setResumeFile(null);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResumeSave}
                  disabled={loading || !resumeFile}
                  className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-60"
                >
                  {loading ? "Uploading..." : "Save Resume"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;

