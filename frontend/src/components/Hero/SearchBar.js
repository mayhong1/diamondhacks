export default function SearchBar() {
  return (
    <div className="search-container">
      <h1 className="search-title">Let's find your next purchase.</h1>
      <div className="search-box-container">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="What would be a good gift for my 15 year old cousin?"
          />
          <button className="search-button">
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
      </div>
    </div>
  );
}
