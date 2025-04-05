import Navbar from "../components/Header/Navbar";
import SearchBar from "../components/Hero/SearchBar";

export default function Home() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <SearchBar />
      </main>
    </div>
  );
}
