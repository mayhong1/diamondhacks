"use client";

import { useState, useEffect } from "react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data.results);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
          />
          <button type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
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
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h2 className="results-title">Search Results</h2>
          <div className="results-list">
            {searchResults.map((result, index) => (
              <div key={index} className="result-item">
                <div className="result-content">
                  {result.content.split('\n').map((line, lineIndex) => (
                    <div
                      key={lineIndex}
                      className={
                        line.startsWith('Title:') ? 'result-title' :
                        line.startsWith('Price:') ? 'result-price' :
                        line.startsWith('Rating:') ? 'result-rating' :
                        'result-detail'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
                {result.category_name && (
                  <div className="result-category">
                    Category: {result.category_name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-message {
          margin-top: 20px;
          color: #e74c3c;
          text-align: center;
        }

        .search-results {
          margin-top: 40px;
          width: 100%;
          max-width: 800px;
        }

        .results-title {
          font-size: 1.5rem;
          margin-bottom: 20px;
          text-align: center;
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-item {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .result-title {
          font-weight: bold;
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .result-price {
          color: #2ecc71;
          font-weight: bold;
        }

        .result-rating {
          color: #f39c12;
        }

        .result-category {
          margin-top: 8px;
          font-style: italic;
          color: #7f8c8d;
        }

        .result-detail {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}
