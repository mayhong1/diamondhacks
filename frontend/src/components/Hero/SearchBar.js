"use client";

import { useState, useEffect } from "react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

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

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError("Voice search is not supported in your browser");
      return;
    }

    const recognitionInstance = new window.webkitSpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognitionInstance.onerror = (event) => {
      setIsListening(false);
      setError("Error occurred in voice recognition: " + event.error);
      setRecognition(null);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      setRecognition(null);
    };

    recognitionInstance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');
      setSearchQuery(transcript);
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
  };

  const stopVoiceSearch = () => {
    if (recognition) {
      recognition.stop();
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
          <button 
            type="button" 
            className={`voice-button ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopVoiceSearch : startVoiceSearch}
            disabled={isLoading}
            title={isListening ? "Stop voice input" : "Start voice input"}
          >
            {isListening ? (
              <>
                <div className="listening-indicator" />
                <svg
                  className="stop-icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </>
            ) : (
              <svg
                className="mic-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 10v2a7 7 0 0 1-14 0v-2"
                />
                <line x1="12" y1="19" x2="12" y2="23" strokeWidth={2} />
                <line x1="8" y1="23" x2="16" y2="23" strokeWidth={2} />
              </svg>
            )}
          </button>
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
        .search-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .search-title {
          text-align: center;
          margin-bottom: 24px;
        }

        .search-box-container {
          width: 100%;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #ddd;
          border-radius: 24px;
          padding: 8px 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          padding: 8px 0;
          background: transparent;
          margin-right: 8px;
        }

        .button-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .voice-button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          transition: all 0.2s;
          position: relative;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          padding: 0;
          margin-right: 50px;
        }

        .voice-button svg {
          width: 24px;
          height: 24px;
          z-index: 2;
        }

        .voice-button:hover {
          background-color: #f0f0f0;
          color: #333;
        }

        .voice-button.listening {
          color: #e74c3c;
          background-color: #fee7e5;
        }

        .voice-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .listening-indicator {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: currentColor;
          opacity: 0.1;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .search-button {
          background: #007AFF;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          padding: 0;
          transition: background-color 0.2s;
        }

        .search-button svg {
          width: 24px;
          height: 24px;
        }

        .search-button:hover {
          background: #0056b3;
        }

        .search-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .stop-icon {
          position: relative;
          z-index: 1;
        }

        .search-input {
          transition: opacity 1s ease;
        }

        .placeholder-fade-out {
          opacity: 0.3;
        }

        .placeholder-fade-in {
          opacity: 1;
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

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 0.1;
          }
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
      `}</style>
    </div>
  );
}
