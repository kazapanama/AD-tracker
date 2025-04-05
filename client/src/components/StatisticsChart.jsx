import React from 'react';
import styled from 'styled-components';

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
      case 'Accepted Request': return '#e1bee7';
      case 'Users Created': return '#bbdefb';
      case 'Jira Request Made': return '#c8e6c9';
      case 'Domain Added': return '#dcedc8';
      case 'Quarantine - 1': return '#fff9c4';
      case 'Quarantine - 2': return '#ffe0b2';
      case 'Quarantine - 3': return '#ffccbc';
      case 'Completed': return '#b2dfdb';
      case 'Rejected': return '#ef9a9a';
      default: return '#e0e0e0';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Accepted Request': return '#6a1b9a';
      case 'Users Created': return '#1565c0';
      case 'Jira Request Made': return '#2e7d32';
      case 'Domain Added': return '#558b2f';
      case 'Quarantine - 1': return '#f9a825';
      case 'Quarantine - 2': return '#ef6c00';
      case 'Quarantine - 3': return '#d84315';
      case 'Completed': return '#00695c';
      case 'Rejected': return '#c62828';
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
      case 'Accepted Request': return '#9c27b0';
      case 'Users Created': return '#2196f3';
      case 'Jira Request Made': return '#4caf50';
      case 'Domain Added': return '#8bc34a';
      case 'Quarantine - 1': return '#ffc107';
      case 'Quarantine - 2': return '#ff9800';
      case 'Quarantine - 3': return '#ff5722';
      case 'Completed': return '#009688';
      case 'Rejected': return '#f44336';
      default: return '#9e9e9e';
    }
  }}
`;

const getTotalCount = (stats) => {
  return stats.reduce((total, item) => total + item.count, 0);
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'Accepted Request': return 'Прийнята заявка';
    case 'Users Created': return 'Створені користувачі';
    case 'Jira Request Made': return 'Зроблена заявка в Jira';
    case 'Domain Added': return 'Заведено в домен';
    case 'Quarantine - 1': return 'Карантин - 1';
    case 'Quarantine - 2': return 'Карантин - 2';
    case 'Quarantine - 3': return 'Карантин - 3';
    case 'Completed': return 'Виконано';
    case 'Rejected': return 'Відхилено';
    default: return status;
  }
};

const StatisticsChart = ({ stats }) => {
  const totalUnits = getTotalCount(stats);
  
  // Sort stats by count in descending order
  const sortedStats = [...stats].sort((a, b) => b.count - a.count);
  
  return (
    <ChartContainer>
      <ChartTitle>Статистика запитів</ChartTitle>
      
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
            {sortedStats.map(item => {
              const percentage = (item.count / totalUnits) * 100;
              
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
  );
};

export default StatisticsChart;