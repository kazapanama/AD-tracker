import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getUnits, deleteUnit, createUnit } from '../utils/api';
import UnitForm from '../components/UnitForm';

const DashboardContainer = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #4b0082;
  margin: 0;
`;

const AddButton = styled.button`
  background-color: #4b0082;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  
  &:hover {
    background-color: #9370db;
    transform: translateY(-2px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled.thead`
  background-color: #4b0082;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${props => props.color || '#4b0082'};
  cursor: pointer;
  margin-right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.hoverBg || 'rgba(75, 0, 130, 0.1)'};
  }
`;

const ViewLink = styled(Link)`
  color: #4b0082;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(75, 0, 130, 0.1);
  }
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
  max-width: 800px;
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

const RefreshButton = styled.button`
  background-color: transparent;
  color: #4b0082;
  border: 1px solid #4b0082;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  margin-left: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(75, 0, 130, 0.1);
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

const DashboardPage = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  useEffect(() => {
    fetchUnits();
    
    // Set up auto refresh every minute
    const intervalId = setInterval(() => {
      fetchUnits();
      setLastUpdated(new Date());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const fetchUnits = async () => {
    setLoading(true);
    try {
      const data = await getUnits();
      setUnits(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching units:', err);
      setError('Помилка завантаження даних. Спробуйте оновити сторінку.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = () => {
    fetchUnits();
    setLastUpdated(new Date());
  };
  
  const handleAddUnit = async (unitData) => {
    try {
      await createUnit(unitData);
      fetchUnits();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error creating unit:', err);
      setError('Помилка при створенні підрозділу. Спробуйте ще раз.');
    }
  };
  
  const handleDeleteClick = (unit) => {
    setUnitToDelete(unit);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!unitToDelete) return;
    
    try {
      await deleteUnit(unitToDelete.id);
      fetchUnits();
      setShowDeleteModal(false);
      setUnitToDelete(null);
    } catch (err) {
      console.error('Error deleting unit:', err);
      setError('Помилка при видаленні підрозділу. Спробуйте ще раз.');
    }
  };
  
  return (
    <DashboardContainer>
      <Header>
        <div>
          <Title>Панель керування</Title>
          <small>Останнє оновлення: {lastUpdated.toLocaleTimeString()}</small>
          <RefreshButton onClick={handleRefresh}>
            Оновити дані
          </RefreshButton>
        </div>
        <AddButton onClick={() => setShowAddModal(true)}>
          Додати підрозділ
        </AddButton>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingSpinner />
      ) : units.length > 0 ? (
        <Table>
          <TableHead>
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Назва підрозділу</TableHeader>
              <TableHeader>Військова частина</TableHeader>
              <TableHeader>Бригада</TableHeader>
              <TableHeader>Статус</TableHeader>
              <TableHeader>Дії</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            {units.map(unit => (
              <TableRow key={unit.id}>
                <TableCell>{unit.id}</TableCell>
                <TableCell>{unit.name_of_unit || '—'}</TableCell>
                <TableCell>{unit.mil_unit}</TableCell>
                <TableCell>{unit.brigade_or_higher || '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={unit.status}>
                    {getStatusLabel(unit.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ViewLink to={`/units/${unit.id}`}>
                    Переглянути
                  </ViewLink>
                  <ActionButton 
                    color="#f44336" 
                    hoverBg="rgba(244, 67, 54, 0.1)"
                    onClick={() => handleDeleteClick(unit)}
                  >
                    Видалити
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center mt-4">
          <p>Немає даних. Додайте новий підрозділ.</p>
        </div>
      )}
      
      {/* Add Unit Modal */}
      {showAddModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Додати новий підрозділ</ModalTitle>
              <CloseButton onClick={() => setShowAddModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <UnitForm 
                onSubmit={handleAddUnit}
                onCancel={() => setShowAddModal(false)}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && unitToDelete && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Підтвердження видалення</ModalTitle>
              <CloseButton onClick={() => setShowDeleteModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <ConfirmationBox>
                <ConfirmationMessage>
                  Ви впевнені, що хочете видалити підрозділ "{unitToDelete.name_of_unit || unitToDelete.mil_unit}"?
                  <br />
                  Ця дія є незворотною.
                </ConfirmationMessage>
                <ConfirmationButtons>
                  <ActionButton
                    onClick={() => setShowDeleteModal(false)}
                    color="#666"
                    hoverBg="#f0f0f0"
                  >
                    Скасувати
                  </ActionButton>
                  <ActionButton
                    onClick={handleConfirmDelete}
                    color="#f44336"
                    hoverBg="rgba(244, 67, 54, 0.1)"
                  >
                    Видалити
                  </ActionButton>
                </ConfirmationButtons>
              </ConfirmationBox>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  );
};

export default DashboardPage;