import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUnitById, updateUnit, deleteUnit } from '../utils/api';
import UnitForm from '../components/UnitForm';

const DetailContainer = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #4b0082;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  background-color: ${props => props.secondary ? 'white' : '#4b0082'};
  color: ${props => props.secondary ? '#4b0082' : 'white'};
  border: ${props => props.secondary ? '1px solid #4b0082' : 'none'};
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  
  &:hover {
    background-color: ${props => props.secondary ? 'rgba(75, 0, 130, 0.1)' : '#9370db'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #ccc;
    color: #666;
    border-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const DeleteButton = styled(Button)`
  background-color: ${props => props.secondary ? 'white' : '#f44336'};
  color: ${props => props.secondary ? '#f44336' : 'white'};
  border: ${props => props.secondary ? '1px solid #f44336' : 'none'};
  
  &:hover {
    background-color: ${props => props.secondary ? 'rgba(244, 67, 54, 0.1)' : '#d32f2f'};
  }
`;

const UnitCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const UnitDetail = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  min-width: 200px;
  color: #555;
`;

const DetailValue = styled.span`
  color: #333;
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

const Description = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
`;

const DescriptionLabel = styled.h3`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 0.75rem;
`;

const DescriptionText = styled.p`
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
`;

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
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  width: 90%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #4b0082;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ConfirmationBox = styled.div`
  padding: 2rem;
  text-align: center;
`;

const ConfirmationMessage = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const ConfirmationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
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

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const getStatusLabel = (status) => {
  switch (status) {
    case 'Accepted Request': return 'Прийнята заявка';
    case 'Users Created': return 'Створені користувачі';
    case 'Jira Request Made': return 'Зроблена заявка в Jira';
    case 'Quarantine - 1': return 'Карантин - 1';
    case 'Quarantine - 2': return 'Карантин - 2';
    case 'Quarantine - 3': return 'Карантин - 3';
    case 'Domain Added': return 'Заведено в домен';
    case 'Completed': return 'Виконано';
    default: return status;
  }
};

const UnitDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  useEffect(() => {
    fetchUnit();
    
    // Set up auto refresh every minute
    const intervalId = setInterval(() => {
      fetchUnit();
      setLastUpdated(new Date());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [id]);
  
  const fetchUnit = async () => {
    setLoading(true);
    try {
      const data = await getUnitById(id);
      setUnit(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching unit:', err);
      setError('Помилка завантаження даних підрозділу. Спробуйте оновити сторінку.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateUnit = async (updatedData) => {
    try {
      await updateUnit(id, updatedData);
      setSuccess('Дані підрозділу успішно оновлено');
      fetchUnit();
      setShowEditModal(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating unit:', err);
      setError('Помилка при оновленні даних підрозділу. Спробуйте ще раз.');
    }
  };
  
  const handleDeleteUnit = async () => {
    try {
      await deleteUnit(id);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Error deleting unit:', err);
      setError('Помилка при видаленні підрозділу. Спробуйте ще раз.');
      setShowDeleteModal(false);
    }
  };
  
  return (
    <DetailContainer>
      <Header>
        <div>
          <Title>Деталі підрозділу</Title>
          <small>Останнє оновлення: {lastUpdated.toLocaleTimeString()}</small>
        </div>
        <ButtonGroup>
          <Button onClick={() => navigate('/dashboard')}>
            Назад до списку
          </Button>
          <Button onClick={() => setShowEditModal(true)} disabled={loading}>
            Редагувати
          </Button>
          <DeleteButton onClick={() => setShowDeleteModal(true)} disabled={loading}>
            Видалити
          </DeleteButton>
        </ButtonGroup>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      {loading ? (
        <LoadingSpinner />
      ) : unit ? (
        <UnitCard>
          <UnitDetail>
            <DetailLabel>ID:</DetailLabel>
            <DetailValue>{unit.id}</DetailValue>
          </UnitDetail>
          
          {unit.name_of_unit && (
            <UnitDetail>
              <DetailLabel>Назва підрозділу:</DetailLabel>
              <DetailValue>{unit.name_of_unit}</DetailValue>
            </UnitDetail>
          )}
          
          <UnitDetail>
            <DetailLabel>Військова частина:</DetailLabel>
            <DetailValue>{unit.mil_unit}</DetailValue>
          </UnitDetail>
          
          {unit.brigade_or_higher && (
            <UnitDetail>
              <DetailLabel>Бригада або вище:</DetailLabel>
              <DetailValue>{unit.brigade_or_higher}</DetailValue>
            </UnitDetail>
          )}
          
          {unit.email && (
            <UnitDetail>
              <DetailLabel>Email:</DetailLabel>
              <DetailValue>{unit.email}</DetailValue>
            </UnitDetail>
          )}
          
          <UnitDetail>
            <DetailLabel>Статус:</DetailLabel>
            <DetailValue>
              <StatusBadge status={unit.status}>
                {getStatusLabel(unit.status)}
              </StatusBadge>
            </DetailValue>
          </UnitDetail>
          
          {unit.date_when_finished && (
            <UnitDetail>
              <DetailLabel>Дата завершення:</DetailLabel>
              <DetailValue>{unit.date_when_finished}</DetailValue>
            </UnitDetail>
          )}
          
          <UnitDetail>
            <DetailLabel>Відправлено в легенду:</DetailLabel>
            <DetailValue>
              {unit.sended_to_legend === 1 ? 'Так' : 'Ні'}
            </DetailValue>
          </UnitDetail>
          
          {unit.description && (
            <Description>
              <DescriptionLabel>Опис:</DescriptionLabel>
              <DescriptionText>{unit.description}</DescriptionText>
            </Description>
          )}
        </UnitCard>
      ) : (
        <div className="text-center mt-4">
          <p>Підрозділ не знайдено</p>
        </div>
      )}
      
      {/* Edit Modal */}
      {showEditModal && unit && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Редагувати підрозділ</ModalTitle>
              <CloseButton onClick={() => setShowEditModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <UnitForm 
                unit={unit}
                onSubmit={handleUpdateUnit}
                onCancel={() => setShowEditModal(false)}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Підтвердження видалення</ModalTitle>
              <CloseButton onClick={() => setShowDeleteModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <ConfirmationBox>
                <ConfirmationMessage>
                  Ви впевнені, що хочете видалити цей підрозділ?
                  <br />
                  Ця дія є незворотною.
                </ConfirmationMessage>
                <ConfirmationButtons>
                  <Button
                    secondary
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Скасувати
                  </Button>
                  <DeleteButton
                    onClick={handleDeleteUnit}
                  >
                    Видалити
                  </DeleteButton>
                </ConfirmationButtons>
              </ConfirmationBox>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </DetailContainer>
  );
};

export default UnitDetailPage;