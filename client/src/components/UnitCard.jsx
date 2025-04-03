import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0;
  color: #4b0082;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
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
      default: return '#616161';
    }
  }};
`;

const CardBody = styled.div`
  margin-bottom: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

const InfoLabel = styled.span`
  font-weight: 500;
  min-width: 130px;
  color: #555;
`;

const InfoValue = styled.span`
  color: #333;
`;

const Description = styled.p`
  color: #666;
  margin-top: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const ViewButton = styled(Link)`
  background-color: #4b0082;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #9370db;
  }
`;

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
    default: return status;
  }
};

const UnitCard = ({ unit }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{unit.name_of_unit || 'Підрозділ'}</CardTitle>
        <StatusBadge status={unit.status}>{getStatusLabel(unit.status)}</StatusBadge>
      </CardHeader>
      
      <CardBody>
        <InfoRow>
          <InfoLabel>Військова частина:</InfoLabel>
          <InfoValue>{unit.mil_unit}</InfoValue>
        </InfoRow>
        
        {unit.brigade_or_higher && (
          <InfoRow>
            <InfoLabel>Бригада:</InfoLabel>
            <InfoValue>{unit.brigade_or_higher}</InfoValue>
          </InfoRow>
        )}
        
        {unit.email && (
          <InfoRow>
            <InfoLabel>Email:</InfoLabel>
            <InfoValue>{unit.email}</InfoValue>
          </InfoRow>
        )}
        
        {unit.date_when_finished && (
          <InfoRow>
            <InfoLabel>Дата завершення:</InfoLabel>
            <InfoValue>{unit.date_when_finished}</InfoValue>
          </InfoRow>
        )}
        
        {unit.description && (
          <Description>{unit.description}</Description>
        )}
      </CardBody>
      
      <CardActions>
        <ViewButton to={`/units/${unit.id}`}>Детальніше</ViewButton>
      </CardActions>
    </Card>
  );
};

export default UnitCard;