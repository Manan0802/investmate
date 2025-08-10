// --- Imports ---
import React, { useEffect, useState } from "react";
import userService from "../services/UserService";
// Using the useAuth hook is a more robust way to get the token
import { useAuth } from "../context/AuthContext";
// Icons for a cleaner UI
import { User, KeyRound } from 'lucide-react';

// --- Main Page Component ---
const ProfilePage = () => {
  // --- State Management ---
  const [userProfile, setUserProfile] = useState(null); // Stores the fetched user profile data
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(""); // For success messages
  const [error, setError] = useState("");     // For error messages
  const [isLoading, setIsLoading] = useState(false); // For the password change button

  // --- Hooks ---
  const { user } = useAuth(); // Get the authenticated user from context
  const token = user?.token; // Extract the token

  /**
   * `useEffect` hook to fetch the user's profile information
   * when the component mounts or when the token changes.
   */
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await userService.getUserProfile(token);
        setUserProfile(profile);
      } catch (err) {
        setError("Failed to fetch user profile. Please try refreshing the page.");
        console.error(err);
      }
    };
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  /**
   * Handles the form submission for changing the user's password.
   */
  const handlePasswordChange = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      await userService.changePassword(oldPassword, newPassword, token);
      setMessage("Password updated successfully!");
      // Clear the input fields on success
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Style Definitions ---
  const cardStyle = "bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg";
  const labelStyle = "block text-sm font-medium text-slate-300";
  const inputStyle = "w-full px-4 py-2 mt-1 bg-slate-900 border border-slate-700 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* --- Page Header --- */}
      <div>
        <h1 className="text-3xl font-bold text-white">User Profile</h1>
        <p className="mt-1 text-slate-400">Manage your account details and password.</p>
      </div>

      {/* --- Main Content --- */}
      {/* The layout is now a responsive grid for better alignment on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Information */}
        <div className={`md:col-span-1 ${cardStyle}`}>
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Your Information</h2>
          </div>
          {userProfile ? (
            <div className="space-y-4 text-slate-300">
              <div>
                <p className="text-sm text-slate-400">Name</p>
                <p className="font-medium text-white">{userProfile.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Email</p>
                <p className="font-medium text-white">{userProfile.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Loading profile...</p>
          )}
        </div>

        {/* Right Column: Change Password */}
        <div className={`md:col-span-2 ${cardStyle}`}>
          <div className="flex items-center gap-3 mb-4">
            <KeyRound className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Display Success or Error Messages */}
            {message && <p className="text-green-400 text-sm p-3 bg-green-500/10 rounded-md">{message}</p>}
            {error && <p className="text-red-400 text-sm p-3 bg-red-500/10 rounded-md">{error}</p>}
            
            <div>
              <label htmlFor="oldPassword" className={labelStyle}>Old Password</label>
              <input
                id="oldPassword"
                type="password"
                placeholder="Enter your current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={inputStyle}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className={labelStyle}>New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputStyle}
                required
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

