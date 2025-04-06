import csv
import pandas as pd
import os
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from langchain_mongodb import MongoDBAtlasVectorSearch
from pymongo import MongoClient
import params
import time

# Step 1: Load Amazon product data (limited to 1000 rows)
print("Loading Amazon product data...")
# Use the correct path based on where the script is run from
csv_path = '../data/amazon_products.csv'
df = pd.read_csv(csv_path, nrows=1000)
print(f"Loaded {len(df)} products")

# Step 2: Convert each product into a Document
print("Converting products to documents...")
docs = []
for _, row in df.iterrows():
    # Combine product information into a text string
    content = f"Title: {row['title']}\n"
    
    # Add other fields that exist
    if 'price' in row and not pd.isna(row['price']):
        content += f"Price: ${row['price']}\n"
    
    if 'stars' in row and not pd.isna(row['stars']):
        content += f"Rating: {row['stars']} stars\n"
    
    if 'reviews' in row and not pd.isna(row['reviews']):
        content += f"Reviews: {row['reviews']}\n"
    
    if 'category_id' in row and not pd.isna(row['category_id']):
        content += f"Category ID: {row['category_id']}\n"
    
    if 'boughtInLastMonth' in row and not pd.isna(row['boughtInLastMonth']):
        content += f"Bought in last month: {row['boughtInLastMonth']}\n"
    
    # Create a Document object with the content and metadata
    doc = Document(
        page_content=content,
        metadata={
            "title": row['title'],
            "price": row['price'],
            "asin": row['asin'],
            "productURL": row['productURL'] if 'productURL' in row and not pd.isna(row['productURL']) else None,
            "source": "amazon_products"
        }
    )
    docs.append(doc)

print(f"Created {len(docs)} document objects")

# Step 3: Embed
print("Creating embeddings...")
embeddings = OpenAIEmbeddings(openai_api_key=params.openai_api_key)

# Step 4: Store
print("Connecting to MongoDB...")
# Initialize MongoDB python client
client = MongoClient(params.mongodb_conn_string)
db = client[params.db_name]
collection = db[params.collection_name]

# Reset without deleting the Search Index 
print("Deleting existing documents...")
collection.delete_many({})

# Try to create the vector search index if it doesn't exist
try:
    print(f"Checking for vector search index '{params.index_name}'...")
    # List all indexes to see if our vector index exists
    indexes = list(collection.list_indexes())
    index_exists = False
    for index in indexes:
        if index.get('name') == params.index_name:
            index_exists = True
            print(f"Vector index '{params.index_name}' already exists")
            break
    
    if not index_exists:
        print(f"Creating vector search index '{params.index_name}'...")
        # Create the vector search index
        index_definition = {
            "fields": [
                {
                    "type": "vector",
                    "path": "embedding",
                    "numDimensions": 1536,  # OpenAI embeddings have 1536 dimensions
                    "similarity": "cosine"
                }
            ]
        }
        
        # Try to create the search index
        try:
            db.command({
                "createSearchIndex": params.collection_name,
                "name": params.index_name,
                "definition": index_definition
            })
            print(f"Created vector search index '{params.index_name}'")
        except Exception as e:
            print(f"Error creating search index: {e}")
except Exception as e:
    print(f"Error checking indexes: {e}")

# Insert the documents in MongoDB Atlas with their embedding
print("Storing documents with embeddings...")
docsearch = MongoDBAtlasVectorSearch.from_documents(
    docs, embeddings, collection=collection, index_name=params.index_name
)

# Verify documents were inserted
count = collection.count_documents({})
print(f"Inserted {count} documents")

# Check if a document has an embedding field
doc = collection.find_one()
if doc and 'embedding' in doc:
    print(f"Embeddings stored correctly. Vector dimension: {len(doc['embedding'])}")
else:
    print("WARNING: Embeddings not found in documents")
    if doc:
        print(f"Fields in document: {list(doc.keys())}")

# Wait a moment for the index to be ready
print("Waiting a moment for the index to be ready...")
time.sleep(2)

# Test a search
print("Testing search functionality...")
try:
    test_results = docsearch.similarity_search("wireless headphones", k=1)
    if test_results and len(test_results) > 0:
        print(f"Search test successful. Found {len(test_results)} results.")
        print(f"Sample result: {test_results[0].page_content[:100]}...")
    else:
        print("WARNING: Search test returned no results.")
except Exception as e:
    print(f"Error during search test: {e}")

print("Amazon product vectorization complete!") 