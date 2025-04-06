import React from "react";
import "./SearchBar.css";

const SearchInput = ({
  searchQuery,
  setSearchQuery,
  isLoading,
  isTransitioning,
  placeholderText,
  isListening,
  onVoiceSearch,
  onImageUpload,
  fileInputRef,
  onImageChange,
}) => {
  return (
    <div className="search-box">
      <input
        type="text"
        className={`search-input ${
          isTransitioning ? "placeholder-fade-out" : "placeholder-fade-in"
        }`}
        placeholder={placeholderText}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="button"
        className={`voice-button ${isListening ? "listening" : ""}`}
        onClick={onVoiceSearch}
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
      <button
        type="button"
        onClick={onImageUpload}
        className="image-button"
        disabled={isLoading}
        title="Upload an image"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/png, image/gif"
        onChange={onImageChange}
        style={{ display: "none" }}
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
  );
};

export default SearchInput;
