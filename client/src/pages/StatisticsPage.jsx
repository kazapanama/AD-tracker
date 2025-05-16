import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getStats } from '../utils/api';

const StatisticsContainer = styled.div``;

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h2`
  font-size: 1.5rem;
  color: #4b0082;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartSection = styled.div``;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background-color: ${props => {
    switch (props.status) {
      case 'Створені користувачі': return '#bbdefb';
      case 'Заявка в jira': return '#c8e6c9';
      case 'Прикінцева конфігурація': return '#dcedc8';
      case 'finita': return '#b2dfdb';
      case 'відхилено': return '#ef9a9a';
      default: return '#e0e0e0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Створені користувачі': return '#1565c0';
      case 'Заявка в jira': return '#2e7d32';
      case 'Прикінцева конфігурація': return '#558b2f';
      case 'finita': return '#00695c';
      case 'відхилено': return '#c62828';
      default: return '#616161';
    }
  }};
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

const BarChartContainer = styled.div`
  margin-top: 1.5rem;
`;

const BarGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const BarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const StatusName = styled.span`
  font-weight: 500;
`;

const StatusCount = styled.span`
  font-weight: 600;
`;

const BarOuter = styled.div`
  height: 12px;
  background-color: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
`;

const BarInner = styled.div`
  height: 100%;
  width: ${props => `${props.percentage}%`};
  background-color: ${props => {
    switch (props.status) {
      case 'Створені користувачі': return '#2196f3';
      case 'Заявка в jira': return '#4caf50';
      case 'Прикінцева конфігурація': return '#8bc34a';
      case 'finita': return '#009688';
      case 'відхилено': return '#f44336';
      default: return '#9e9e9e';
    }
  }}
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
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

// Define the order of statuses for the workflow
const statusOrder = [
  'Створені користувачі',
  'Заявка в jira',
  'Прикінцева конфігурація',
  'finita'
];

const getStatusLabel = (status) => {
  switch (status) {
    case 'Створені користувачі': return 'Створені користувачі';
    case 'Заявка в jira': return 'Заявка в jira';
    case 'Прикінцева конфігурація': return 'Прикінцева конфігурація';
    case 'finita': return 'Завершено';
    case 'відхилено': return 'Відхилено';
    default: return status;
  }
};

const getTotalCount = (stats) => {
  return stats.reduce((total, item) => total + item.count, 0);
};

const StatisticsPage = () => {
  const [stats, setStats] = useState([]);
  const [progressiveStats, setProgressiveStats] = useState([]);
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
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
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
      
      // Calculate progressive stats
      calculateProgressiveStats(completeStats);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Помилка завантаження статистики. Спробуйте оновити сторінку.');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateProgressiveStats = (stats) => {
    // Initialize counts for each status
    const progressiveCounts = {};
    statusOrder.forEach(status => {
      progressiveCounts[status] = 0;
    });
    
    // Calculate progressive counts
    stats.forEach(item => {
      // Handle normal statuses
      if (item.status !== 'відхилено') {
        const statusIndex = statusOrder.indexOf(item.status);
        if (statusIndex > -1) {
          // Add counts to this status and all previous statuses
          for (let i = 0; i <= statusIndex; i++) {
            progressiveCounts[statusOrder[i]] += item.count;
          }
        }
      } 
      // Handle rejected status specially
      else if (item.status === 'відхилено' && item.count > 0) {
        // For rejected status, count as 1 users created and 1 jira ticket
        progressiveCounts['Створені користувачі'] += item.count;
        progressiveCounts['Заявка в jira'] += item.count;
      }
    });
    
    // Convert to array format
    const progressiveStatsArray = Object.keys(progressiveCounts).map(status => ({
      status,
      count: progressiveCounts[status]
    }));
    
    // Add the rejected status separately
    const rejectedStat = stats.find(item => item.status === 'відхилено');
    if (rejectedStat) {
      progressiveStatsArray.push(rejectedStat);
    }
    
    setProgressiveStats(progressiveStatsArray);
  };
  
  const handleRefresh = () => {
    fetchStats();
    setLastUpdated(new Date());
  };
  
  return (
    <StatisticsContainer>
      <h1 style={{ color: '#4b0082', marginBottom: '1rem' }}>Розширена статистика процесів</h1>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Regular Stats */}
          <ChartContainer>
            <ChartTitle>Загальна статистика запитів</ChartTitle>
            
            <ChartGrid>
              <ChartSection>
                <StatsGrid>
                  {stats.slice(0, 4).map(item => (
                    <StatCard key={item.status} status={item.status}>
                      <StatValue>{item.count}</StatValue>
                      <StatLabel>{getStatusLabel(item.status)}</StatLabel>
                    </StatCard>
                  ))}
                </StatsGrid>
                
                <StatsGrid>
                  {stats.slice(4).map(item => (
                    <StatCard key={item.status} status={item.status}>
                      <StatValue>{item.count}</StatValue>
                      <StatLabel>{getStatusLabel(item.status)}</StatLabel>
                    </StatCard>
                  ))}
                </StatsGrid>
              </ChartSection>
              
              <ChartSection>
                <BarChartContainer>
                  {[...stats].sort((a, b) => b.count - a.count).map(item => {
                    const totalUnits = getTotalCount(stats);
                    const percentage = totalUnits > 0 ? (item.count / totalUnits) * 100 : 0;
                    
                    return (
                      <BarGroup key={item.status}>
                        <BarLabel>
                          <StatusName>{getStatusLabel(item.status)}</StatusName>
                          <StatusCount>{item.count}</StatusCount>
                        </BarLabel>
                        <BarOuter>
                          <BarInner 
                            percentage={percentage} 
                            status={item.status} 
                          />
                        </BarOuter>
                      </BarGroup>
                    );
                  })}
                </BarChartContainer>
              </ChartSection>
            </ChartGrid>
          </ChartContainer>
          
          {/* Progressive Stats */}
          <ChartContainer>
            <ChartTitle>Кумулятивна статистика процесів</ChartTitle>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              Ця статистика відображає загальну кількість підрозділів, що пройшли кожен етап процесу.
            </p>
            
            <ChartGrid>
              <ChartSection>
                <StatsGrid>
                  {progressiveStats.slice(0, 4).map(item => (
                    <StatCard key={item.status} status={item.status}>
                      <StatValue>{item.count}</StatValue>
                      <StatLabel>{getStatusLabel(item.status)}</StatLabel>
                    </StatCard>
                  ))}
                </StatsGrid>
                
                <StatsGrid>
                  {progressiveStats.slice(4).map(item => (
                    <StatCard key={item.status} status={item.status}>
                      <StatValue>{item.count}</StatValue>
                      <StatLabel>{getStatusLabel(item.status)}</StatLabel>
                    </StatCard>
                  ))}
                </StatsGrid>
              </ChartSection>
              
              <ChartSection>
                <BarChartContainer>
                  {progressiveStats.filter(item => item.status !== 'відхилено').map(item => {
                    const maxCount = Math.max(
                      ...progressiveStats
                        .filter(s => s.status !== 'відхилено')
                        .map(s => s.count)
                    );
                    const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    
                    return (
                      <BarGroup key={item.status}>
                        <BarLabel>
                          <StatusName>{getStatusLabel(item.status)}</StatusName>
                          <StatusCount>{item.count}</StatusCount>
                        </BarLabel>
                        <BarOuter>
                          <BarInner 
                            percentage={percentage} 
                            status={item.status} 
                          />
                        </BarOuter>
                      </BarGroup>
                    );
                  })}
                  
                  {/* Display rejected stats separately */}
                  {progressiveStats.filter(item => item.status === 'відхилено').map(item => {
                    const totalUnits = getTotalCount(stats);
                    const percentage = totalUnits > 0 ? (item.count / totalUnits) * 100 : 0;
                    
                    return (
                      <BarGroup key={item.status}>
                        <BarLabel>
                          <StatusName>{getStatusLabel(item.status)}</StatusName>
                          <StatusCount>{item.count}</StatusCount>
                        </BarLabel>
                        <BarOuter>
                          <BarInner 
                            percentage={percentage} 
                            status={item.status} 
                          />
                        </BarOuter>
                      </BarGroup>
                    );
                  })}
                </BarChartContainer>
              </ChartSection>
            </ChartGrid>
          </ChartContainer>
          
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
    </StatisticsContainer>
  );
};

export default StatisticsPage;