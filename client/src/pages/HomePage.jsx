import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStats, searchUnits } from '../utils/api';
import StatisticsChart from '../components/StatisticsChart';
import SearchBar from '../components/SearchBar';
import UnitCard from '../components/UnitCard';

const HomeContainer = styled.div``;

const SearchResultsContainer = styled.div`
  margin-top: 2rem;
`;

const ResultsTitle = styled.h2`
  font-size: 1.5rem;
  color: #4b0082;
  margin-bottom: 1.5rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 2rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  &:after {
    content: " ";
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 6px solid #4b0082;
    border-color: #4b0082 transparent #4b0082 transparent;
    animation: spinner 1.2s linear infinite;
  }
  
  @keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const RefreshButton = styled.button`
  background-color: transparent;
  color: #4b0082;
  border: 1px solid #4b0082;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(75, 0, 130, 0.1);
  }
`;

const HomePage = () => {
  const [stats, setStats] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  useEffect(() => {
    fetchStats();
    
    // Set up auto refresh every minute
    const intervalId = setInterval(() => {
      fetchStats();
      setLastUpdated(new Date());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      // If no data received, use empty array to avoid errors
      const statsData = data || [];
      
      // Add missing statuses with count 0
      const allStatuses = [
        'Accepted Request', 
        'Users Created', 
        'Jira Request Made', 
        'Domain Added', 
        'Quarantine - 1', 
        'Quarantine - 2', 
        'Quarantine - 3', 
        'Completed'
      ];
      
      const completeStats = allStatuses.map(status => {
        const existing = statsData.find(item => item.status === status);
        return existing || { status, count: 0 };
      });
      
      setStats(completeStats);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Помилка завантаження статистики. Спробуйте оновити сторінку.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async (query) => {
    setIsSearching(true);
    setLoading(true);
    try {
      const data = await searchUnits(query);
      setSearchResults(data || []);
      setError(null);
    } catch (err) {
      console.error('Error searching units:', err);
      setError('Помилка пошуку. Спробуйте ще раз.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = () => {
    fetchStats();
    setLastUpdated(new Date());
    // Clear search results when refreshing
    setSearchResults([]);
    setIsSearching(false);
  };
  
  return (
    <HomeContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading && !isSearching ? (
        <LoadingSpinner />
      ) : (
        <>
          <StatisticsChart stats={stats} />
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <small>Останнє оновлення: {lastUpdated.toLocaleTimeString()}</small>
            <div>
              <RefreshButton onClick={handleRefresh}>
                Оновити дані
              </RefreshButton>
            </div>
          </div>
        </>
      )}
      
      <SearchBar onSearch={handleSearch} />
      
      {isSearching && (
        <SearchResultsContainer>
          <ResultsTitle>Результати пошуку</ResultsTitle>
          
          {loading ? (
            <LoadingSpinner />
          ) : searchResults.length > 0 ? (
            <ResultsGrid>
              {searchResults.map(unit => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </ResultsGrid>
          ) : (
            <NoResults>
              <h3>Нічого не знайдено</h3>
              <p>Спробуйте змінити параметри пошуку</p>
            </NoResults>
          )}
        </SearchResultsContainer>
      )}
    </HomeContainer>
  );
};

export default HomePage;