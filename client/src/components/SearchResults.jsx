import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { clearSearch, hideResults } from '../store/slices/searchSlice';

const ResultsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #eee;
  z-index: 1000;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ResultItem = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f0ff;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ResultTitle = styled.div`
  font-weight: 500;
  color: #4b0082;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResultComputer = styled.div`
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NoResults = styled.div`
  padding: 1rem;
  text-align: center;
  color: #666;
`;

const LoadingText = styled.div`
  padding: 1rem;
  text-align: center;
  color: #666;
`;

const ResultCount = styled.div`
  padding: 0.5rem 1rem;
  background-color: #f5f0ff;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  color: #4b0082;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #999;
  cursor: pointer;
  padding: 0 5px;
  
  &:hover {
    color: #4b0082;
  }
`;

const SearchResults = () => {
  const { filteredResults, loading, showResults } = useSelector(state => state.search);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleSelectResult = (unitId) => {
    navigate(`/units/${unitId}`);
    dispatch(clearSearch());
  };
  
  const handleCloseResults = (e) => {
    e.stopPropagation();
    dispatch(hideResults());
  };
  
  if (!showResults) return null;
  
  return (
    <ResultsDropdown>
      <CloseButton onClick={handleCloseResults}>×</CloseButton>
      {loading ? (
        <LoadingText>Завантаження...</LoadingText>
      ) : filteredResults.length > 0 ? (
        <>
          <ResultCount>
            Знайдено: {filteredResults.length}
          </ResultCount>
          {filteredResults.map(unit => (
            <ResultItem 
              key={unit.id}
              onClick={() => handleSelectResult(unit.id)}
            >
              <ResultTitle>
                {unit.name_of_unit || unit.mil_unit}
              </ResultTitle>
              <ResultComputer>
                {unit.computer_name ? `ПК: ${unit.computer_name}` : 'ПК: не вказано'}
              </ResultComputer>
            </ResultItem>
          ))}
        </>
      ) : (
        <NoResults>Нічого не знайдено</NoResults>
      )}
    </ResultsDropdown>
  );
};

export default SearchResults;