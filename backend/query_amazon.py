import argparse
import params
from pymongo import MongoClient
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_openai import OpenAIEmbeddings
from langchain_openai import OpenAI
import warnings

# Filter out warnings
warnings.filterwarnings("ignore", category=UserWarning)

# Category mapping
CATEGORIES = {
    104: "Suitcases",
    110: "Men's Clothing"
}

def search_amazon(query, category=None):
    """
    Search for Amazon products based on query and optional category filter.
    
    Args:
        query (str): Search query for Amazon products
        category (int, optional): Category ID filter (104: Suitcases, 110: Men's Clothing)
        
    Returns:
        list: List of search results with product information, category, and link
    """
    # Initialize MongoDB python client
    client = MongoClient(params.mongodb_conn_string)
    collection = client[params.db_name][params.collection_name]

    # initialize vector store
    embeddings = OpenAIEmbeddings(openai_api_key=params.openai_api_key)
    vectorStore = MongoDBAtlasVectorSearch(
        collection, embeddings, index_name=params.index_name
    )

    # Perform similarity search
    docs = vectorStore.similarity_search(query, k=10)  # Get more results to allow for filtering

    # Process search results
    results = []
    results_shown = 0
    
    for i, doc in enumerate(docs):
        # If category filter is applied, check that the document matches in the text content
        if category:
            category_found = False
            category_str = f"Category ID: {category}"
            if category_str in doc.page_content:
                category_found = True
            
            if not category_found:
                continue
        
        # Extract category name if present
        doc_category = None
        link = None
        title = None
        
        # Extract info from content
        content_lines = doc.page_content.split('\n')
        for line in content_lines:
            if "Category ID: " in line:
                try:
                    category_id = int(line.split("Category ID: ")[1].strip())
                    if category_id in CATEGORIES:
                        doc_category = CATEGORIES[category_id]
                except ValueError:
                    pass
            elif "Title:" in line:
                title = line.split("Title:")[1].strip()
            elif "Link:" in line:
                link = line.split("productURL:")[1].strip()
        
        # Generate Amazon product search link if no link found but title exists
        if not link and title:
            # Format title for Amazon search URL
            search_query = title.replace(" ", "+")
            link = f"https://www.amazon.com/s?k={search_query}"
        
        # Add result to list
        results.append({
            "content": doc.page_content,
            "category_name": doc_category,
            "link": link
        })
        
        results_shown += 1
        
        # Stop after collecting 5 results
        if results_shown >= 5:
            break
    
    return results

# This allows the file to be both imported and run directly
if __name__ == "__main__":
    # Process arguments
    parser = argparse.ArgumentParser(description='Amazon Product Search Demo')
    parser.add_argument('-q', '--question', help="The search query for Amazon products")
    parser.add_argument('-c', '--category', type=int, choices=[104, 110], help="Filter by category ID (104: Suitcases, 110: Men's Clothing)")
    args = parser.parse_args()

    if args.question is None:
        # Some queries to try...
        query = "luggage wheels"
    else:
        query = args.question

    print("\nYour search query:")
    print("----------------")
    print(query)

    if args.category:
        print(f"Filtering by category: {CATEGORIES[args.category]}")
    
    # Call the search function
    results = search_amazon(query, args.category)

    # Print results
    print("\nSearch Results:")
    print("--------------")
    
    if not results:
        print("No matching products found.")
    else:
        for i, result in enumerate(results, 1):
            print(f"\nResult #{i}:")
            print(result["content"])
            if result["category_name"]:
                print(f"Category: {result['category_name']}")
            if result["link"]:
                print(f"Link: {result['link']}")
            print("-" * 50)
    
    print("\nSearch complete!")