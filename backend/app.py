from flask import Flask, request, jsonify
from flask_cors import CORS
from query_amazon import search_amazon
from image_processor import analyze_image
import logging
import os
from werkzeug.utils import secure_filename

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define configuration for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
CORS(app)  # Enable CORS for all routes

def allowed_file(filename):
    """Check if the file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return jsonify({"message": "Server is running"}), 200

@app.route('/api/search')
def search():
    query = request.args.get('q', '')
    category = request.args.get('category')
    
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400
    
    # Convert category to int if provided
    if category:
        try:
            category = int(category)
        except ValueError:
            return jsonify({"error": "Category must be a valid integer"}), 400
    
    try:
        # Use search_amazon function from query_amazon.py
        results = search_amazon(query, category)
        
        # Log results to verify links are included
        for i, result in enumerate(results):
            logger.info(f"Result #{i+1} link: {result.get('link')}")
        
        return jsonify({
            "query": query,
            "category": category,
            "results": results,
            "total_results": len(results)
        })
    except Exception as e:
        logger.error(f"Error processing search request: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    # Check if an image was included in the request
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    
    # Check if the file is empty
    if file.filename == '':
        return jsonify({"error": "No image selected"}), 400
    
    # Check if the file has an allowed extension
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed. Please use jpg, jpeg, png, or gif."}), 400
    
    try:
        # Get the query text if provided
        query_text = request.form.get('query', 'Find products like this')
        
        # Save the file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        logger.info(f"Image saved temporarily at {filepath}")
        
        # Process the image with Gemini API
        with open(filepath, 'rb') as img_file:
            image_description = analyze_image(img_file, f"Describe this product in less than 50 words: {query_text}")
                # Clean up the file after processing
        try:
            os.remove(filepath)
            logger.info(f"Temporary file {filepath} removed")
        except Exception as e:
            logger.warning(f"Failed to remove temporary file {filepath}: {str(e)}")
            
        logger.info(f"Image description: {image_description}")
        
        # If we got an error from the image analysis, still continue with basic search
        if image_description.startswith("Error analyzing image"):
            logger.warning(f"Using fallback search without image analysis: {image_description}")
            combined_query = query_text
        else:
            # Combine the original query with the image description
            combined_query = f"{query_text} {image_description}"
            
        logger.info(f"Combined query: {combined_query}")
        
        # Perform the search with the combined query
        results = search_amazon(combined_query)
        
        return jsonify({
            "query": combined_query,
            "image_description": image_description,
            "results": results,
            "total_results": len(results)
        })
    except Exception as e:
        logger.error(f"Error processing image search: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Flask server on port 5000")
    app.run(debug=True, port=5000) 