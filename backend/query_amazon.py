import argparse
import params
import certifi
import sys
from google import genai
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

# QUERY NEGATION PREPROCESSING
client = genai.Client(api_key=params.gemini_key)

is_negated = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[f"Does the query {query} contain a negation clause? Respond with yes or no only"]
)

if (is_negated.text.strip().casefold() == 'yes'.casefold()):
    print("The phrase does have a negation")

    negated_clause = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[f"Extract the negated adjective from the following sentence: ‘{query}’. Return only the negated adjective (not including the negation word)."]
    )

    print(f"The negated clause is {negated_clause.text}")

    unnegated_search = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[f"Please analyze the following phrase and perform these transformations:\
            1. Identify negation words: Find words like 'not,' 'un-,' 'in-,' 'non-,' 'without,' and similar terms.\
            2. Identify negated adjectives: Determine which adjectives are being negated by the identified negation words.\
            3. Remove negation words and negated adjectives: Delete both the negation words and the adjectives they negate.\
            4. Preserve other adjectives: Leave any adjectives that are not being negated intact.\
            5. Respond only with the transformed phrase\
            Phrase: {query}\
        "]
    )

    print(f"An unnegated version would be {unnegated_search.text}")
else:
    print("The phrase does not have a negation")

sys.exit()


print("\nYour search query:")
print("----------------")
print(query)

if args.category:
    print(f"Filtering by category: {CATEGORIES[args.category]}")

# Initialize MongoDB python client
client = MongoClient(params.mongodb_conn_string, tlsCAFile=certifi.where())
collection = client[params.db_name][params.collection_name]

# initialize vector store
embeddings = OpenAIEmbeddings(openai_api_key=params.openai_api_key)
vectorStore = MongoDBAtlasVectorSearch(
    collection, embeddings, index_name=params.index_name
)

# Perform similarity search
print("\nSearch Results:")
print("--------------")
docs = vectorStore.similarity_search(query, k=20)  # Get more results to allow for filtering

print(len(docs))

"""
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
"""