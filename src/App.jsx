import React, { useState, useEffect } from "react";
import "./App.css";
import MovieCard from "./MovieCard";

const API_URL = "https://omdbapi.com/?apikey=fe2f6c44";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalResults, setTotalResults] = useState(0); 

  
  const searchMovies = async (title, page = 1, year = "") => {
    const response = await fetch(`${API_URL}&s=${title}&page=${page}${year ? `&y=${year}` : ""}`);
    const data = await response.json();

    if (data.Search) {
      setMovies(data.Search);
      setTotalResults(parseInt(data.totalResults));
    } else {
      setMovies([]);
      setTotalResults(0);
    }
  };

  useEffect(() => {
    searchMovies("SpiderMan", 1);
  }, []);

  const totalPages = Math.ceil(totalResults / 10); 
  return (
    <div className="app">
      <h1>Movie Center</h1>

      
      <div className="search">
        <input
          placeholder="Search for Movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          src="https://img.icons8.com/ios-filled/50/000000/search.png"
          alt="search icon"
          onClick={() => {
            setCurrentPage(1);
            searchMovies(searchTerm, 1, yearFilter);
          }}
        />
      </div>

      <div className="filter">
        <input
          type="number"
          placeholder="(e.g. 2020)"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        />
        <button
          onClick={() => {
            setCurrentPage(1);
            searchMovies(searchTerm || "SpiderMan", 1, yearFilter);
          }}
        >
          Apply Filter
        </button>
      </div>

      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No Movies found</h2>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => prev - 1);
              searchMovies(searchTerm || "SpiderMan", currentPage - 1, yearFilter);
            }}
          >
             Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
              searchMovies(searchTerm || "SpiderMan", currentPage + 1, yearFilter);
            }}
          >
            Next 
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
