/**
 * Service for handling search-related API calls
 */

/**
 * Search for products using a text query
 * @param {string} query - The search query
 * @returns {Promise<Object>} - The search results
 */
export const searchProducts = async (query) => {
  const response = await fetch(
    `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  console.log("Text search results:", data.results);
  return data;
};

/**
 * Search for products using an image
 * @param {File} imageFile - The image file to search with
 * @param {string} query - Optional text query to accompany the image
 * @returns {Promise<Object>} - The search results
 */
export const searchWithImage = async (
  imageFile,
  query = "Find products like this"
) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("query", query);

  const response = await fetch("http://localhost:5000/api/upload-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  console.log("Image search results:", data);
  return data;
};
