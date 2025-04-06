# DiamondHacks 2025 Project

A project created during DiamondHacks, ACM@UCSD's hackathon! Made by May Hong, Markus Gruendler, Spencer Cowles, and Daniel Bonkowsky

# Overview

## Inspiration
If you search up "not red shirt" on Amazon.com, you are presented with a bunch of red shirts. Traditional keyword search for e-commerce has its flaws. Particular syntax and an inability to handle certain aspects of natural language like negation impede the product finding process and hurt the user experience, while also encouraging keyword spam in product listings. 

## What We Do
Our system leverages semantic search through vector embeddings to understand the meaning behind a user's query—not just the keywords. Unlike traditional search engines that focus on literal word matching, our model captures context and intent. For example:
* "Not red shirt" filters out red items altogether.
* “Clothes to make me look ripped" prioritizes fitted and athletic clothing, not garments that are literally torn.

This contextual understanding allows for much more natural, conversational queries—something keyword search engines fundamentally can’t do.

## How it Works
Though our program looks like a simple search bar, this is **the most technically advanced project** that we've ever built. Here are the many very complicated steps that we took. 

**Setting up data:**
First, parsed a CSV file with 1.4 million items of Amazon and performed an algorithm to select only the clothing items, cutting it down to ~260,000 items to fit our MongoDB storage limits. Then, we vectorized our data. Next came the real challenge: vectorization. This involved a multi-step pipeline—**Loading → Transforming → Embedding → Storing** the data. We used **OpenAIEmbeddings with LangChain** to generate vectors, and then stored everything in a **custom-configured MongoDB Atlas vector index.** We had to manually define and create the search index, handle rate limits, and write scripts to automate the entire process. At full scale, this pipeline takes **~3 hours** to complete end-to-end, showing just how much data we're working with.

**Query function:**
The search functionality is where it gets even cooler. We built a semantic search pipeline that takes natural language queries, **embeds them using OpenAI’s API**, and **runs similarity searches** against the stored product vectors using MongoDB Atlas Vector Search. To make our search even more intelligent, we added implemented **filters utilizing Google Gemini’s to check for negative keywords**. We also dynamically parsed structured metadata (titles, prices, product links) from unstructured document content. It’s fast, accurate, and scalable.

**Image and voice search:**
We also built multimodal input. For image search, we use PIL to preprocess user-uploaded images, then send them to Google Gemini’s vision API, turning visuals into searchable descriptions. For voice input, we integrated webkitSpeechRecognition to let users search just by speaking. It's smooth and accessible.

**Frontend:**
Compared to the rest of our goliath of a project, our frontend may sound less boring, but it involved hours of hard work. It's clean, responsive, and fully integrated with all our backend endpoints. Feel free to try it out and break it (or be amazed).

**Tech Stack:**
Backend: Python, Flask, MongoDB, LangChain, Google Gemini, Pandas (for data manipulation) 
Frontend: Javascript, Node.JS, React, HTML/CSS

## Challenges We Ran Into
Negation was very tricky to pull off. Even searches like "I don't want blue shoes" tended to return blue shoes because the embedding model (correctly) identified that blue was a very important part of the query. To solve this issue, we preprocessed user searches with Google Gemini to identify when negations were occurring and remove the results that shouldn't be there, using similarity search chaining.

## Use cases
Semantic search truly revolutionizes search, leaving keyword search in the dust. Here is who benefits from being able to search with natural language:
* Elderly individuals who may not be familiar with typing search queries in a precise, "robotic" format
* Users who may forget specific product names but can describe them in natural language (e.g., "the device that heats up bread")
* Children learning to use technology who speak naturally rather than type structured queries
* Users looking for recommendations based on vague ideas or feelings (e.g., “a cozy movie for a rainy day”)
* Individuals with temporary impairments (e.g., injury, illness) affecting their ability to type so want to search by just talking
* You! You can now find "shirts that make me look rip" or "not red shirts"

## How to Run
Make sure that you have all the dependencies installed!!!

Running backend: 
1. cd into backend
2. have flask dependencies installed (should be in requirements.txt)
3. run "python app.py"

Running frontend:
1. cd into frontend
2. npm install
3. npm run dev
