"use client";

import { useState, useEffect } from "react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const placeholderTexts = [
    "What would be a good gift for my 15 year old cousin?",
    "I need a birthday present for my mom",
    "Looking for a graduation gift",
    "What's a good anniversary gift?",
    "Need ideas for a housewarming present",
  ];

  // Effect to cycle through placeholder texts with animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setIsTransitioning(true);

      // After fade out, change text and start fade in
      setTimeout(() => {
        setPlaceholderIndex(
          (prevIndex) => (prevIndex + 1) % placeholderTexts.length
        );
        setIsTransitioning(false);
      }, 500); // Half of the transition time
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Here you can handle the search query
    console.log("Search query:", searchQuery);
    // TODO: Add your search logic here
  };

  return (
    <div className="search-container">
      <h1 className="search-title">Let's find your next purchase.</h1>
      <form onSubmit={handleSearch} className="search-box-container">
        <div className="search-box">
          <input
            type="text"
            className={`search-input ${
              isTransitioning ? "placeholder-fade-out" : "placeholder-fade-in"
            }`}
            placeholder={placeholderTexts[placeholderIndex]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <svg
              className="search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      <style jsx>{`
        .search-input {
          transition: opacity 1s ease;
        }

        .placeholder-fade-out {
          opacity: 0.3;
        }

        .placeholder-fade-in {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
