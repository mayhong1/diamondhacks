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
    print("Please input a question")
    sys.exit()
else:
    search = args.question

# QUERY NEGATION PREPROCESSING
is_negated = False
negated_clause = ""
positive_search = ""

client = genai.Client(api_key=params.gemini_key)

is_negated_query = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[f"In the following phrase, Identify negation words: Find words \
        like 'not,' 'un-,' 'in-,' 'non-,' 'without,' and similar terms. If \
        there are any, respond yes. Otherwise, respond no.\
        Phrase: {search}"]
)
is_negated = (is_negated_query.text.strip().casefold() == 'yes'.casefold())

if (is_negated):
    negated_clause_query = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[f"Extract the negated adjective from the following sentence: ‘{search}’. Return only the negated adjective (not including the negation word)."]
    )
    negated_clause = negated_clause_query.text

    positive_search_query = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[f"Please analyze the following phrase and perform these transformations:\
            1. Identify negation words: Find words like 'not,' 'un-,' 'in-,' 'non-,' 'without,' and similar terms.\
            2. Identify negated adjectives: Determine which adjectives are being negated by the identified negation words.\
            3. Remove negation words and negated adjectives: Delete both the negation words and the adjectives they negate.\
            4. Preserve other adjectives: Leave any adjectives that are not being negated intact.\
            5. Respond only with the transformed phrase\
            Phrase: {search}\
        "]
    )
    positive_search = positive_search_query.text

print(f"Original search: {search}")
print(f"is_negated: {is_negated}")
print(f"negated_clause: {negated_clause}")
print(f"positive_search: {positive_search}")

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

if (not is_negated):
    docs = vectorStore.similarity_search(search, k=5)

    for i, doc in enumerate(docs):
        print(f'Result #{i}')
        print(doc.page_content)
else:
    
    broad_query = vectorStore.similarity_search(positive_search, k=10)

    doc_indices = [doc.metadata.get("index") for doc in broad_query]

    exclude_query = vectorStore.similarity_search(
        negated_clause,
        k=5,
        pre_filter={"index":{"$in":doc_indices}}
    )

    result_num = 1
    for doc in broad_query:
        if (not (doc in exclude_query)):
            print(f"Result #{result_num}")
            print(doc.page_content)
            result_num += 1
    
    print("")
    print("EXCLUDED RESULTS --------------------------------------------------------------------------------------------")
    for doc in exclude_query:
        print(doc.page_content)