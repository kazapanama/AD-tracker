import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { addUnit } from '../store/slices/unitSlice';
import UnitForm from './UnitForm';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #4b0082;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const AddUnitModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleAddUnit = async (unitData) => {
    try {
      dispatch(addUnit(unitData));
      onClose();
    } catch (err) {
      console.error('Error creating unit:', err);
    }
  };

  return (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Додати новий підрозділ</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>
          <UnitForm
            onSubmit={handleAddUnit}
            onCancel={onClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddUnitModal;