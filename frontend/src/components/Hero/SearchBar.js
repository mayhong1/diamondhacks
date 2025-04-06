"use client";

import { useState, useEffect, useRef } from "react";
import SearchInput from "./SearchInput";
import ImagePreview from "./ImagePreview";
import SearchResults from "./SearchResults";
import ErrorMessage from "./ErrorMessage";
import { searchProducts, searchWithImage } from "../../services/searchService";
import "./SearchBar.css";

export default function SearchBar() {
  // Group related state
  const [searchState, setSearchState] = useState({
    query: "",
    results: [],
    isLoading: false,
    error: null,
  });

  const [imageState, setImageState] = useState({
    file: null,
    preview: null,
  });

  const [placeholderState, setPlaceholderState] = useState({
    index: 0,
    isTransitioning: false,
  });

  const [voiceState, setVoiceState] = useState({
    isListening: false,
    recognition: null,
  });

  const fileInputRef = useRef(null);

  const placeholderTexts = [
    "What would be a good gift for my 15 year old cousin?",
    "I need a birthday present for my mom",
    "Looking for a graduation gift",
    "What's a good anniversary gift?",
    "Need ideas for a housewarming present",
    "I want to buy some not red shirts",
    "Show me my dream watch",
  ];

  // Effect to cycle through placeholder texts with animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setPlaceholderState((prev) => ({ ...prev, isTransitioning: true }));

      // After fade out, change text and start fade in
      setTimeout(() => {
        setPlaceholderState((prev) => ({
          index: (prev.index + 1) % placeholderTexts.length,
          isTransitioning: false,
        }));
      }, 500); // Half of the transition time
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchState.query.trim() && !imageState.file) {
      setSearchState((prev) => ({
        ...prev,
        error: "Please enter a search query or upload an image",
      }));
      return;
    }

    setSearchState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      results: [],
    }));

    try {
      let data;

      // If there's an image file, use the image upload endpoint
      if (imageState.file) {
        data = await searchWithImage(
          imageState.file,
          searchState.query || "Find products like this"
        );
      } else {
        // Otherwise use the regular search endpoint
        data = await searchProducts(searchState.query);
      }

      setSearchState((prev) => ({
        ...prev,
        results: data.results,
      }));
    } catch (err) {
      console.error("Error fetching search results:", err);
      setSearchState((prev) => ({
        ...prev,
        error: "Failed to fetch search results. Please try again.",
      }));
    } finally {
      setSearchState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSearchState((prev) => ({
        ...prev,
        error: "Image size exceeds 5MB limit",
      }));
      return;
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setSearchState((prev) => ({
        ...prev,
        error: "Invalid file type. Please use JPG, PNG, or GIF",
      }));
      return;
    }

    setImageState({ file, preview: null });
    setSearchState((prev) => ({ ...prev, error: null }));

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageState((prev) => ({ ...prev, preview: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageState({ file: null, preview: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const startVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setSearchState((prev) => ({
        ...prev,
        error: "Voice search is not supported in your browser",
      }));
      return;
    }

    const recognitionInstance = new window.webkitSpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onstart = () => {
      setVoiceState({ isListening: true, recognition: recognitionInstance });
      setSearchState((prev) => ({ ...prev, error: null }));
    };

    recognitionInstance.onerror = (event) => {
      setVoiceState({ isListening: false, recognition: null });
      setSearchState((prev) => ({
        ...prev,
        error: "Error occurred in voice recognition: " + event.error,
      }));
    };

    recognitionInstance.onend = () => {
      setVoiceState({ isListening: false, recognition: null });
    };

    recognitionInstance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setSearchState((prev) => ({ ...prev, query: transcript }));
    };

    recognitionInstance.start();
  };

  const stopVoiceSearch = () => {
    if (voiceState.recognition) {
      voiceState.recognition.stop();
    }
  };

  return (
    <div className="search-container">
      <h1 className="search-title">
        Let's find your{" "}
        <span className="text-[#780000] animate-bounce-subtle">next</span>{" "}
        purchase.
      </h1>
      <h2 className="text-center text-lg text-gray-600 mb-6 font-medium">
        Search by <i>text</i>, <i>voice</i>, or <i>image</i> to find{" "}
        <b>exactly what you want</b>, even without knowing exactly what you're
        looking for!
      </h2>
      <form onSubmit={handleSearch} className="search-box-container">
        <SearchInput
          searchQuery={searchState.query}
          setSearchQuery={(query) =>
            setSearchState((prev) => ({ ...prev, query }))
          }
          isLoading={searchState.isLoading}
          isTransitioning={placeholderState.isTransitioning}
          placeholderText={placeholderTexts[placeholderState.index]}
          isListening={voiceState.isListening}
          onVoiceSearch={
            voiceState.isListening ? stopVoiceSearch : startVoiceSearch
          }
          onImageUpload={triggerFileInput}
          fileInputRef={fileInputRef}
          onImageChange={handleImageChange}
        />

        {imageState.preview && (
          <ImagePreview
            imagePreview={imageState.preview}
            searchQuery={searchState.query}
            onClearImage={clearImage}
          />
        )}
      </form>

      {searchState.error && <ErrorMessage message={searchState.error} />}

      {searchState.results.length > 0 && (
        <SearchResults results={searchState.results} />
      )}
    </div>
  );
}
