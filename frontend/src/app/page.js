import Navbar from "../components/Header/Navbar";
import SearchBar from "../components/Hero/SearchBar";
import Footer from "../components/Footer/Footer";

export default function Home() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <SearchBar />
      </main>
      <Footer />
    </div>
  );
}
