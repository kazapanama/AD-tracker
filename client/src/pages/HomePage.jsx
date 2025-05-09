import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { getStats } from '../utils/api';
import { clearSearch } from '../store/slices/searchSlice';
import StatisticsChart from '../components/StatisticsChart';
import UnitCard from '../components/UnitCard';

const HomeContainer = styled.div``;

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
  const dispatch = useDispatch();
  const { error: searchError } = useSelector(state => state.search);
  
  const [stats, setStats] = useState([]);
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
    
    // Clear search on component unmount
    return () => {
      clearInterval(intervalId);
      dispatch(clearSearch());
    };
  }, [dispatch]);
  
  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      // If no data received, use empty array to avoid errors
      const statsData = data || [];
      
      // Add missing statuses with count 0
      const allStatuses = [
        'Створені користувачі',
        'Заявка в jira',
        'Прикінцева конфігурація',
        'finita',
        'відхилено'
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
  
  const handleRefresh = () => {
    fetchStats();
    setLastUpdated(new Date());
    dispatch(clearSearch());
  };
  
  return (
    <HomeContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {searchError && <ErrorMessage>{searchError}</ErrorMessage>}
      
      {loading ? (
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
    </HomeContainer>
  );
};

export default HomePage;