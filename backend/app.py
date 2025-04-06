from flask import Flask, request, jsonify
from flask_cors import CORS
from query_amazon import search_amazon
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
        
        return jsonify({
            "query": query,
            "category": category,
            "results": results,
            "total_results": len(results)
        })
    except Exception as e:
        logger.error(f"Error processing search request: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Flask server on port 5000")
    app.run(debug=True, port=5000) 