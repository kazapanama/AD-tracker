import React from 'react';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
`;

const RoundButton = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: #ff2e98;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    background-color:rgb(248, 29, 139);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  }
`;

const FloatingAddButton = ({ onClick }) => {
  return (
    <ButtonContainer>
      <RoundButton onClick={onClick} aria-label="Додати підрозділ">
        <span>+</span>
      </RoundButton>
    </ButtonContainer>
  );
};

export default FloatingAddButton;