import React from "react";
import { getInitials } from "../../utils/helper";

export default function ProfileInfo({ userInfo, onLogout }) {

    // Add null check
    if (!userInfo) {
      return null; // Or return a placeholder/loading state
    }
    
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(userInfo.fullName)}
      </div>
      <div>
        <p className="text-sm font-medium">{userInfo.fullName}</p>
        <button className="text text-slate-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
