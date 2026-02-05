import { useState, useEffect } from "react";
import { getMyProfile } from "../../api/profile.api";
import EditProfileModal from "./EditProfileModal";

export default function ViewProfile() {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyProfile();
      setUserData(res.data.user);
      setProfileData(res.data.profile);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfileData(updatedProfile);
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <button
              onClick={() => setShowEditModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
            >
              Edit Profile
            </button>
          </div>

          {/* User Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-gray-300 pb-3">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Name
                </label>
                <p className="text-lg text-gray-800 mt-2">{userData?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Email
                </label>
                <p className="text-lg text-gray-800 mt-2">{userData?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Role
                </label>
                <p className="text-lg text-gray-800 mt-2 capitalize">
                  {userData?.role?.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600">
                  Status
                </label>
                <p className="text-lg mt-2">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${
                      userData?.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userData?.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Profile-Specific Information */}
          {profileData && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b-2 border-gray-300 pb-3">
                Profile Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(profileData).map(([key, value]) => {
                  if (
                    key === "_id" ||
                    key === "userId" ||
                    key === "__v" ||
                    key === "createdAt" ||
                    key === "updatedAt" ||
                    key === "borrowedBooks" ||
                    key === "activeEquipment"
                  ) {
                    return null;
                  }

                  if (Array.isArray(value)) {
                    return (
                      <div key={key}>
                        <label className="block text-sm font-semibold text-gray-600">
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace(/([A-Z])/g, " $1")}
                        </label>
                        <p className="text-lg text-gray-800 mt-2">
                          {value.length > 0 ? `${value.length} courses enrolled` : "No courses enrolled"}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-600">
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <p className="text-lg text-gray-800 mt-2">
                        {value || "Not set"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profileData={profileData}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
}
