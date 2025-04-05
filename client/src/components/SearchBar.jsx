import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, performSearch } from '../store/slices/searchSlice';
import styles from './SearchBar.module.css';

const SearchBar = ({ inHeader = false, onSearch = null }) => {
  const dispatch = useDispatch();
  const { query } = useSelector(state => state.search);
  
  // Debounce search for live searching
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query && query.trim().length >= 2) {
        dispatch(performSearch(query));
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [query, dispatch]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(performSearch(query));
      // If onSearch is provided (for backward compatibility with HomePage), call it
      if (onSearch) {
        onSearch(query);
      }
    }
  };
  
  return (
    <div className={inHeader ? `${styles.searchContainer} ${styles.searchContainerHeader}` : styles.searchContainer}>
      <form 
        className={inHeader ? `${styles.searchForm} ${styles.searchFormHeader}` : styles.searchForm} 
        onSubmit={handleSubmit}
      >
        <input
          className={inHeader ? `${styles.searchInput} ${styles.searchInputHeader}` : styles.searchInput}
          type="text"
          placeholder={inHeader ? "Швидкий пошук..." : "Пошук за назвою, частиною, бригадою або описом..."}
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
        />
        <button 
          className={inHeader ? `${styles.searchButton} ${styles.searchButtonHeader}` : styles.searchButton} 
          type="submit" 
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;