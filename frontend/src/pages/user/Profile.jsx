import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Eye, SquarePen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { User } from "lucide-react";
import { Brain, School, File, Code } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../services/api";

const Profile = () => {
  const { user, fetchUser, fetchApplicants } = useAuth();
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
  const [skillsForm, setSkillsForm] = useState("");
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
        dob: user.dob || "",
        location: user.location || "",
      });

      setSkillsForm({
        skills: user.skills || "",
        companyName: user.experience.companyName || "",
        year: user.experience.year || ""
      });

      setEducationForm(
        user.education || {
          level: "",
          institution: "",
          board: "",
          startDate: "",
          endDate: "",
          percentage: "",
        },
      );
    }
  }, [user]);

  // for profile image
  const [imageFile, setImageFile] = useState();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload image");
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
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await api.put("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message);
      fetchUser();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Profile picture update filed check image si",
      );
    } finally {
      setEditAvatar(false);
    }
  };
  // update prifle info
  const handleProfileSave = async () => {
    const payload = profileForm;
    try {
      const res = await api.put("/user/profile", payload);
      toast.success(res.data.message);
      fetchUser();
    } catch (error) {
      toast.error("Profile update filed");
    } finally {
      toast.success(res.data.message);
      setEditProfile(false);
    }
  };
  // update personal details
  const handlePersonalSave = async () => {
    const payload = personalForm;
    const res = await api.put("/user/personal", payload);
    toast.success(res.data.message);
    fetchUser();
    setEditPersonal(false);
  };
  // update skill & experience
  const handleSkillsSave = async () => {
    const payload = skillsForm;

    const res = await api.put("/user/skills", payload);
    toast.success(res.data.message);
    fetchUser();
    setEditSkills(false);
  };
  // update education information
  const handleEducationSave = async () => {
    const payload = {
      ...educationForm,
      startDate: educationForm.startDate
        ? new Date(educationForm.startDate)
        : null,
      endDate: educationForm.endDate ? new Date(educationForm.endDate) : null,
    };

    const res = await api.put("/user/education", payload);
    toast.success(res.data.message);
    fetchUser();

    setEducation(false);
  };

  // resume update
  const [resumeFile, setResumeFile] = useState();
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("application/pdf")) {
      return toast.error("Please upload pdf");
    }

    setResumeFile(file);
  };
  const handleResumeSave = async () => {
    if (!resumeFile) {
      return toast.error("Please select pdf file");
    }

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      setLoading(true);
      const res = await api.patch("/user/resume", formData, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
      console.log(res);
      toast.success(res.data.message);

      fetchUser();
    } catch (error) {
      toast.error("File can't update");
    } finally {
      setLoading(false);
      setResume(false);
    }
  };


  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 relative">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="text-sm text-gray-500">
            Manage your personal information and resume
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg p-6 flex items-center gap-6 shadow">
          <img
            src={user?.avatar?.url || "/user.png"}
            alt="profile"
            className="rounded-full w-18 h-18 cursor-pointer"
            onClick={() => setEditAvatar(true)}
          />

          <div className="flex-1 roboto">
            <h2 className="text-lg font-semibold text-gray-700">
              {[user?.firstname, user?.middlename, user?.lastname]
                .filter(Boolean)
                .join(" ")}
            </h2>

            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <div
            className="px-4 py-2 cursor-pointer text-gray-600"
            onClick={() => setEditProfile(true)}
          >
            <SquarePen />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Details */}
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between text-xl">
              <h3 className="font-semibold mb-4">
                {" "}
                <div className="flex gap-2 text-gray-700">
                  <User />
                  Personal Details
                </div>
              </h3>
              <div
                className="px-4 py-2 cursor-pointer text-gray-600"
                onClick={() => setEditPersonal(true)}
              >
                <SquarePen />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span>
                  {user?.phone?.countryCode} {user?.phone?.phoneNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gender</span>
                <span>
                  {" "}
                  {user?.gender
                    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                    : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date of Birth</span>
                <span>
                  {new Date(user?.dob).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }) || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span>{user?.location}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between">
              <h3 className="font-semibold mb-4 text-xl">
                <div className="flex gap-2 text-gray-700">
                  {" "}
                  <Brain /> Skills
                </div>
              </h3>
              <div
                className="px-4 py-2 cursor-pointer text-gray-600"
                onClick={() => setEditSkills(true)}
              >
                <SquarePen />
              </div>
            </div>
            <div className="flex flex-wrap">
              {user?.skills?.split(",").map((e, key) => (
                <span
                  key={key}
                  className="px-2 py-1 text-sm rounded"
                >
                  <p className=" bg-blue-100 px-2 py-1 rounded-md text-blue-700">
                    {e}
                  </p>
                </span>
              ))}
            </div>
            <div className="mt-6 px-2">
              <div>
                <p className="text-gray-500">Experience</p>
              </div>
              <div className="flex justify-between mt-2">

                <p className="text-gray-900">{user?.experience?.companyName}</p>
                <p>{user?.experience?.year}</p>

              </div>

            </div>
          </div>
        </div>

        {/* Education */}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between text-xl">
            <h3 className="font-semibold mb-4">
              <div className="flex gap-2 text-gray-700">
                <School />
                Education
              </div>
            </h3>
            <div
              className="px-4 py-2 cursor-pointer text-gray-600 "
              onClick={() => setEducation(true)}
            >
              <SquarePen />
            </div>
          </div>
          {user?.education?.map((e) => (
            <div
              className="space-y-2 px-5 mt-3  p-2 rounded border-gray-100 shadow"
              key={e.level}
            >
              <p className="font-medium">{e.level}</p>
              <div className="flex justify-between">
                <p className="font-medium">{e.board}</p>
                <p className="text-gray-500">Marks: {e.percentage}%</p>
              </div>
              <p className="text-gray-500">{e.institution}</p>
              <p className="text-gray-500">
                {e?.startDate || e?.endDate
                  ? `${new Date(e?.startDate).getFullYear()} - ${new Date(e?.endDate).getFullYear()}`
                  : ""}
              </p>
            </div>
          ))}
        </div>

        {/* Resume */}
        <div className="bg-white shadow-md transition rounded-xl p-6 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
              <File className="w-5 h-5 text-indigo-600" />
              Resume
            </div>

            <p className="text-sm text-gray-500">
              Upload or update your resume
            </p>

            {user?.resume?.url ? (
              <button
                onClick={() =>
                  window.open(
                    `https://docs.google.com/gview?url=${user.resume.url}&embedded=true`,
                    "_blank",
                  )
                }
                className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                <Eye className="w-4 h-4" />
                View Resume
              </button>
            ) : (
              <p className="mt-2 text-sm text-red-500">No resume uploaded</p>
            )}
          </div>

          <button
            onClick={() => setResume(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title="Edit Resume"
          >
            <SquarePen className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* edit image (avater) */}

      {editAvatar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditAvatar(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-600">
              Upload Profile Picture
            </h2>
            <label
              htmlFor="imageUpload"
              className="border flex justify-center rounded-md text-gray-400 cursor-pointer"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <img src="/uploadIcon.png" className="w-20" alt="upload" />
              )}
            </label>

            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setEditAvatar(false);
                  setImagePreview(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAvatarSave();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* edit profile section (name) */}
      {editProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditProfile(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-600">
              Edit Profile
            </h2>

            <div className="space-y-3">
              <input
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                placeholder="First Name"
                value={profileForm.firstname}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, firstname: e.target.value })
                }
              />
              <input
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Middle Name"
                value={profileForm.middlename}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, middlename: e.target.value })
                }
              />

              <input
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Last Name"
                value={profileForm.lastname}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, lastname: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditProfile(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditProfile(false);
                  handleProfileSave();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* edit personal details */}
      {editPersonal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditPersonal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-600">
              Edit Personal Details
            </h2>

            <div className="space-y-3">
              {/* mobile number */}
              <input
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Phone number"
                value={personalForm.phone}
                onChange={(e) =>
                  setPersonalForm({ ...personalForm, phone: e.target.value })
                }
              />
              {/* gender */}
              <select
                name="gender"
                id="gender"
                value={personalForm.gender || ""}
                onChange={(e) =>
                  setPersonalForm({ ...personalForm, gender: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-300 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {/* date of birth */}
              <input
                type="date"
                name="dob"
                value={personalForm.dob || ""}
                onChange={(e) =>
                  setPersonalForm({ ...personalForm, dob: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300
             focus:outline-none focus:ring-1 focus:ring-purple-500
             focus:border-purple-500 text-gray-700"
              />

              {/* location */}
              <input
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Location e.g Kolkata"
                value={personalForm.location}
                onChange={(e) =>
                  setPersonalForm({ ...personalForm, location: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditPersonal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  (setEditPersonal(false), handlePersonalSave());
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* skills details */}
      {editSkills && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditSkills(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-600">
              Edit Skills
            </h2>

            <div className="space-y-3">
              {/* Skills */}
              <input
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                placeholder="React, Javascript"
                value={skillsForm.skills}
                onChange={(e) =>
                  setSkillsForm({ ...skillsForm, skills: e.target.value })
                }
              />

              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter company name"
                value={skillsForm.companyName}
                onChange={(e) =>
                  setSkillsForm({ ...skillsForm, companyName: e.target.value })
                }
              />

              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter experience year"
                value={skillsForm.year}
                onChange={(e) =>
                  setSkillsForm({ ...skillsForm, year: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditSkills(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEditSkills(false);
                  handleSkillsSave();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* education details */}
      {editEducation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEducation(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-600">
              Edit Education
            </h2>

            <div className="space-y-3">
              {/* Level */}
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                value={educationForm.level}
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

              {/* Institution */}
              <input
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Institution / College Name"
                value={educationForm.institution}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    institution: e.target.value,
                  })
                }
              />

              {/* Board / University */}
              <input
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Board / University"
                value={educationForm.board}
                onChange={(e) =>
                  setEducationForm({ ...educationForm, board: e.target.value })
                }
              />

              {/* Start Date */}
              <label
                htmlFor=""
                className="px-3 text-sm font-semibold text-gray-700"
              >
                Start date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                value={educationForm.startDate}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    startDate: e.target.value,
                  })
                }
              />

              {/* End Date */}
              <label
                htmlFor=""
                className="px-3 text-sm font-semibold text-gray-700"
              >
                End date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                value={educationForm.endDate}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    endDate: e.target.value,
                  })
                }
              />

              {/* Percentage */}
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Percentage"
                value={educationForm.percentage}
                onChange={(e) =>
                  setEducationForm({
                    ...educationForm,
                    percentage: e.target.value,
                  })
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEducation(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  setEducation(false);
                  handleEducationSave();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* // resume edit  */}
      {editResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setResume(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-600">
              Upload Resume
            </h2>
            <label
              htmlFor="resume"
              className="w-full border border-gray-400 rounded-md flex justify-center cursor-pointer"
            >
              {resumeFile ? (
                <img src="/done.png" width={200} alt="" />
              ) : (
                <img src="/uploadIcon.png" width={200} alt="" />
              )}

              <input
                type="file"
                id="resume"
                hidden
                accept="application/pdf"
                onChange={handlePdfChange}
              />
            </label>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setResume(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleResumeSave();
                }}
                disabled={loading}
                className={`px-4 py-2  text-white rounded  ${loading ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-700"} `}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Profile;
