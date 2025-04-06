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

# Initialize MongoDB python client
client = MongoClient(params.mongodb_conn_string)
collection = client[params.db_name][params.collection_name]

# initialize vector store
embeddings = OpenAIEmbeddings(openai_api_key=params.openai_api_key)
vectorStore = MongoDBAtlasVectorSearch(
    collection, embeddings, index_name=params.index_name
)

# Perform similarity search
print("\nSearch Results:")
print("--------------")
docs = vectorStore.similarity_search(query, k=10)  # Get more results to allow for filtering

# Print each product with some formatting
results_shown = 0
for i, doc in enumerate(docs):
    # If category filter is applied, check that the document matches in the text content
    if args.category:
        category_found = False
        category_str = f"Category ID: {args.category}"
        if category_str in doc.page_content:
            category_found = True
        
        if not category_found:
            continue
    
    results_shown += 1
    print(f"\nResult #{results_shown}:")
    print(doc.page_content)
    
    # Print category name if we can extract it
    if "Category ID: " in doc.page_content:
        for line in doc.page_content.split('\n'):
            if "Category ID: " in line:
                try:
                    category_id = int(line.split("Category ID: ")[1].strip())
                    if category_id in CATEGORIES:
                        print(f"Category: {CATEGORIES[category_id]}")
                except ValueError:
                    pass
    
    print("-" * 50)
    
    # Stop after showing 5 results
    if results_shown >= 5:
        break

if results_shown == 0:
    print("No matching products found.")

print("\nSearch complete!")