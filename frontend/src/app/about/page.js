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
              Our Product
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-xl border border-[var(--border-color)]">
              <p className="text-lg text-[var(--text-color)] mb-4">
                text text text text text text text text text text text text text
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div>
            <h2 className="text-3xl font-semibold mb-6 text-[var(--text-color)]">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
