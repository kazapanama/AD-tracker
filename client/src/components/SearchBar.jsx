import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, performSearch } from '../store/slices/searchSlice';

const SearchContainer = styled.div`
  margin-bottom: ${props => props.inHeader ? '0' : '2rem'};
  width: 100%;
`;

const SearchForm = styled.form`
  display: flex;
  max-width: ${props => props.inHeader ? '100%' : '600px'};
  margin: ${props => props.inHeader ? '0' : '0 auto'};
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${props => props.inHeader ? '0.5rem 0.75rem' : '0.75rem 1rem'};
  font-size: ${props => props.inHeader ? '0.9rem' : '1rem'};
  border: 2px solid ${props => props.inHeader ? 'rgba(255, 255, 255, 0.2)' : '#ddd'};
  border-right: none;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: ${props => props.inHeader ? 'rgba(255, 255, 255, 0.1)' : 'white'};
  color: ${props => props.inHeader ? 'white' : 'inherit'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.inHeader ? 'rgba(255, 255, 255, 0.5)' : '#4b0082'};
    background-color: ${props => props.inHeader ? 'rgba(255, 255, 255, 0.15)' : 'white'};
  }
  
  &::placeholder {
    color: ${props => props.inHeader ? 'rgba(255, 255, 255, 0.7)' : '#999'};
  }
`;

const SearchButton = styled.button`
  background-color: ${props => props.inHeader ? 'rgba(255, 255, 255, 0.1)' : '#4b0082'};
  color: white;
  border: none;
  border: 2px solid ${props => props.inHeader ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border-left: none;
  padding: 0 ${props => props.inHeader ? '0.75rem' : '1.5rem'};
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.inHeader ? 'rgba(255, 255, 255, 0.2)' : '#9370db'};
  }
  
  svg {
    width: ${props => props.inHeader ? '16px' : '20px'};
    height: ${props => props.inHeader ? '16px' : '20px'};
  }
`;

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
    <SearchContainer inHeader={inHeader}>
      <SearchForm onSubmit={handleSubmit} inHeader={inHeader}>
        <SearchInput
          type="text"
          placeholder={inHeader ? "Швидкий пошук..." : "Пошук за назвою, частиною, бригадою або описом..."}
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          inHeader={inHeader}
        />
        <SearchButton type="submit" aria-label="Search" inHeader={inHeader}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </SearchButton>
      </SearchForm>
    </SearchContainer>
  );
};

export default SearchBar;