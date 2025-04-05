from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_mongodb import MongoDBAtlasVectorSearch
from pymongo import MongoClient
import params
import time

# Step 1: Load
print("Loading documents...")
loaders = [
 WebBaseLoader("https://en.wikipedia.org/wiki/AT%26T"),
 WebBaseLoader("https://en.wikipedia.org/wiki/Bank_of_America")
]
data = []
for loader in loaders:
    data.extend(loader.load())
print(f"Loaded {len(data)} documents")

# Step 2: Transform (Split)
print("Splitting documents...")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0, separators=[
                                               "\n\n", "\n", r"(?<=\. )", " "], length_function=len)
docs = text_splitter.split_documents(data)
print(f'Split into {len(docs)} chunks')

# Step 3: Embed
print("Creating embeddings...")
# https://api.python.langchain.com/en/latest/embeddings/langchain.embeddings.openai.OpenAIEmbeddings.html
embeddings = OpenAIEmbeddings(openai_api_key=params.openai_api_key)

# Step 4: Store
print("Connecting to MongoDB...")
# Initialize MongoDB python client
client = MongoClient(params.mongodb_conn_string)
db = client[params.db_name]
collection = db[params.collection_name]

# Reset w/out deleting the Search Index 
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
# https://github.com/hwchase17/langchain/blob/master/langchain/vectorstores/mongodb_atlas.py
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
    test_results = docsearch.similarity_search("Who started AT&T?", k=1)
    if test_results and len(test_results) > 0:
        print(f"Search test successful. Found {len(test_results)} results.")
        print(f"Sample result: {test_results[0].page_content[:100]}...")
    else:
        print("WARNING: Search test returned no results.")
except Exception as e:
    print(f"Error during search test: {e}")

print("Vectorization complete!")