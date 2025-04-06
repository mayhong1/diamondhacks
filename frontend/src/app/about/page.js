import React from "react";
import Navbar from "../../components/Header/Navbar";
import Footer from "../../components/Footer/Footer";

export default function AboutPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-[var(--text-color)]">
              About Our Project
            </h1>
            <p className="text-xl text-[var(--secondary-color)]">
              Built for DiamondHacks 2025!
            </p>
          </div>

          {/* Product Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-[var(--text-color)]">
              Natural Language Semantic Search
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-xl border border-[var(--border-color)]">
              <p className="text-lg text-[var(--text-color)] mb-4">
                If you search up "not red shirt" on Amazon.com, you are presented with a bunch of red shirts. Traditional keyword search for e-commerce has its flaws. Particular syntax and an inability to handle certain aspects of natural language like negation impede the product finding process and hurt the user experience, while also encouraging keyword spam in product listings.
                
                <br></br> &emsp; Our project aims to revolutionize e-commerce search by building a negation-compatible semantic search system. Using Amazon's products as an example, we gathered clothing listings, encoded them with high dimensional vectors to capture their meaning, and give you the ability to search for products by their meaning, synonyms, and what sets them apart from similar results. Rather than traditional keyword matching, users can describe what they're looking for in everyday language, and our search algorithm recognizes the semantic intent to return the most relevant products. This makes product discovery more intuitive and accessible for online shoppers.

                <br></br> &emsp; A drawback of traditional search engines is inability to deal with negation, or phrases that include words like “not,” “without,” or “exclude.” If a user searches for “red shirt but not long sleeve,” a traditional search lists results for red long-sleeve shirts. By contrast, our algorithm uniquely adjusts its search criteria by first excluding the terms to avoid and finding results that most closely capture the meaning behind the positive search criteria. It then makes a second pass over the matching products, excluding those that match the negative search criteria the user wants to avoid.
                <br></br> &emsp; A dataset of Amazon clothing products was chosen to highlight the most common use case for negative clause handling, but this can be extrapolated to any range of products for any ecommerce site. Allowing for negation subsequently allows prompts that are more similar to natural language, especially when paired with a search utilizing semantic meaning rather than strict keywords. This method also increases the accessibility of search tools for users that struggle with the robotic syntax that keyword search demands for the most successful results, such as groups who are less likely to understand why natural language queries aren't always compatible with keyword search (think of the elderly, the young, etc), groups who are less likely to be able to describe or recall the exact brand or name of the item they have in mind, but can instead describe it by meaning: “device that heats up bread” for a microwave (people who are forgetful or not fluent in a language), or groups that make use of tools like dictation instead of a traditional keyboard and mouse (people with disabilities).
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div>
            <h2 className="text-3xl font-semibold mb-6 text-[var(--text-color)]">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member Cards - Add more as needed */}
              <div className="bg-white rounded-lg p-6 shadow-xl border border-[var(--border-color)]">
                <div className="w-24 h-24 bg-[var(--input-bg)] rounded-full mx-auto mb-4 border border-[var(--border-color)]"></div>
                <h3 className="text-xl font-semibold text-center mb-2 text-[var(--text-color)]">
                  May Hong
                </h3>
                <p className="text-[var(--secondary-color)] text-center">
                  Member
                </p>
                <p className="text-[var(--text-color)] text-center mt-2">bio</p>
              </div>
              {/* Add more team member cards as needed */}
              <div className="bg-white rounded-lg p-6 shadow-xl border border-[var(--border-color)]">
                <div className="w-24 h-24 bg-[var(--input-bg)] rounded-full mx-auto mb-4 border border-[var(--border-color)]"></div>
                <h3 className="text-xl font-semibold text-center mb-2 text-[var(--text-color)]">
                  Markus Gruendler
                </h3>
                <p className="text-[var(--secondary-color)] text-center">
                  Member
                </p>
                <p className="text-[var(--text-color)] text-center mt-2">bio</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-xl border border-[var(--border-color)]">
                <div className="w-24 h-24 bg-[var(--input-bg)] rounded-full mx-auto mb-4 border border-[var(--border-color)]"></div>
                <h3 className="text-xl font-semibold text-center mb-2 text-[var(--text-color)]">
                  Daniel Bonkowsky
                </h3>
                <p className="text-[var(--secondary-color)] text-center">
                  Member
                </p>
                <p className="text-[var(--text-color)] text-center mt-2">bio</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-xl border border-[var(--border-color)]">
                <div className="w-24 h-24 bg-[var(--input-bg)] rounded-full mx-auto mb-4 border border-[var(--border-color)]"></div>
                <h3 className="text-xl font-semibold text-center mb-2 text-[var(--text-color)]">
                  Spencer Cowles
                </h3>
                <p className="text-[var(--secondary-color)] text-center">
                  Member
                </p>
                <p className="text-[var(--text-color)] text-center mt-2">bio</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
