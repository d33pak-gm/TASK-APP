import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

export default function Navbar({ userInfo, onSearchTask, handleClearSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    console.log("Search Query:", searchQuery);
    // if (searchQuery) {
    //   onSearchTask(searchQuery);
    //}
    // if (!searchQuery.trim()) return;
    // onSearchTask(searchQuery);
    if (searchQuery.trim()) {
      onSearchTask(searchQuery);
    } else {
      console.log("Search query is empty"); // Debug: Log empty query
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    onSearchTask("");
    handleClearSearch();
  };

  const hideSearchBar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="bg-white flex items-center justify-between px-6 drop-shadow-sm">
      <h2 className=" text-xl font-medium text-black py-2">Tasks</h2>
      {console.log(`hideSearchBar-> ${hideSearchBar}`)}
      
      {!hideSearchBar && (
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
      )}

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
}
