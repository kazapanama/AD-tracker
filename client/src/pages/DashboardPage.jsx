import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnits, sortUnits, setFilter, clearFilters, removeUnit } from '../store/slices/unitSlice';
import { addUnit } from '../store/slices/unitSlice';
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
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &::after {
    content: '${props => props.sorted ? (props.sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}';
    position: absolute;
    margin-left: 0.5rem;
  }
`;

const FilterContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  color: #555;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4b0082;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4b0082;
  }
`;

const ClearFiltersButton = styled.button`
  background-color: transparent;
  color: #4b0082;
  border: 1px solid #4b0082;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  height: fit-content;
  align-self: flex-end;
  
  &:hover {
    background-color: rgba(75, 0, 130, 0.1);
  }
`;

const DisplayCount = styled.div`
  background-color: #f5f0ff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #4b0082;
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
    case 'Створені користувачі': return 'Створені користувачі';
    case 'Заявка в jira': return 'Заявка в jira';
    case 'Прикінцева конфігурація': return 'Прикінцева конфігурація';
    case 'finita': return 'Завершено';
    case 'відхилено': return 'Відхилено';
    default: return status;
  }
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { 
    filteredItems: units, 
    loading, 
    error, 
    sortField, 
    sortDirection,
    displayCount
  } = useSelector(state => state.units);
  
  // Removed local add modal state to use global one
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const location = useLocation();
  const [filters, setFilters] = useState({
    name_of_unit: '',
    brigade_or_higher: '',
    mil_unit: '',
    email: '',
    status: location.state?.filterStatus || '',
    computer_name: '',
    date_from: '',
    date_to: ''
  });
  
  useEffect(() => {
    dispatch(fetchUnits());
    
    // Set up auto refresh every minute
    const intervalId = setInterval(() => {
      dispatch(fetchUnits());
      setLastUpdated(new Date());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [dispatch]);
  
  // Apply the status filter from location state when component mounts
  useEffect(() => {
    if (location.state?.filterStatus) {
      // Update the UI filter display
      setFilters(prev => ({ ...prev, status: location.state.filterStatus }));
      
      // Apply the filter in Redux
      dispatch(setFilter({ field: 'status', value: location.state.filterStatus }));
      
      // Clear the location state to prevent reapplying filter on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, dispatch]);
  
  const handleSort = (field) => {
    dispatch(sortUnits(field));
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    dispatch(setFilter({ field: name, value }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      name_of_unit: '',
      brigade_or_higher: '',
      mil_unit: '',
      email: '',
      status: '',
      computer_name: '',
      date_from: '',
      date_to: ''
    });
    dispatch(clearFilters());
  };
  
  const handleRefresh = () => {
    dispatch(fetchUnits());
    setLastUpdated(new Date());
  };
  
  // Removed handleAddUnit as it's now handled by the global modal
  
  const handleDeleteClick = (unit) => {
    setUnitToDelete(unit);
    setShowDeleteModal(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!unitToDelete) return;
    
    try {
      dispatch(removeUnit(unitToDelete.id));
      setShowDeleteModal(false);
      setUnitToDelete(null);
    } catch (err) {
      console.error('Error deleting unit:', err);
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
        <AddButton onClick={() => window.location.href = "#add-unit"}>
          Додати підрозділ
        </AddButton>
      </Header>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FilterContainer>
        <FilterGroup>
          <FilterLabel>Назва підрозділу</FilterLabel>
          <FilterInput 
            type="text" 
            name="name_of_unit"
            value={filters.name_of_unit}
            onChange={handleFilterChange}
            placeholder="Фільтр..."
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Військова частина</FilterLabel>
          <FilterInput 
            type="text" 
            name="mil_unit"
            value={filters.mil_unit}
            onChange={handleFilterChange}
            placeholder="Фільтр..."
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Бригада</FilterLabel>
          <FilterInput 
            type="text" 
            name="brigade_or_higher"
            value={filters.brigade_or_higher}
            onChange={handleFilterChange}
            placeholder="Фільтр..."
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Email</FilterLabel>
          <FilterInput 
            type="text" 
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
            placeholder="Фільтр..."
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Статус</FilterLabel>
          <FilterSelect
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Всі статуси</option>
            <option value="Створені користувачі">Створені користувачі</option>
            <option value="Заявка в jira">Заявка в jira</option>
            <option value="Прикінцева конфігурація">Прикінцева конфігурація</option>
            <option value="finita">Завершено</option>
            <option value="відхилено">Відхилено</option>
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Ім'я комп'ютера</FilterLabel>
          <FilterInput 
            type="text" 
            name="computer_name"
            value={filters.computer_name}
            onChange={handleFilterChange}
            placeholder="Фільтр..."
          />
        </FilterGroup>
        
        
        <FilterGroup>
          <FilterLabel>Дата від</FilterLabel>
          <FilterInput 
            type="date" 
            name="date_from"
            value={filters.date_from}
            onChange={handleFilterChange}
          />
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Дата до</FilterLabel>
          <FilterInput 
            type="date" 
            name="date_to"
            value={filters.date_to}
            onChange={handleFilterChange}
          />
        </FilterGroup>
        
        <ClearFiltersButton onClick={handleClearFilters}>
          Очистити фільтри
        </ClearFiltersButton>
      </FilterContainer>
      
      <DisplayCount>
        Відображено записів: {displayCount}
      </DisplayCount>
      
      {loading ? (
        <LoadingSpinner />
      ) : units.length > 0 ? (
        <Table>
          <TableHead>
            <tr>
              <TableHeader 
                onClick={() => handleSort('name_of_unit')}
                sorted={sortField === 'name_of_unit'}
                sortDirection={sortDirection}
              >Назва підрозділу</TableHeader>
              <TableHeader 
                onClick={() => handleSort('mil_unit')}
                sorted={sortField === 'mil_unit'}
                sortDirection={sortDirection}
              >Військова частина</TableHeader>
              <TableHeader 
                onClick={() => handleSort('brigade_or_higher')}
                sorted={sortField === 'brigade_or_higher'}
                sortDirection={sortDirection}
              >Бригада</TableHeader>
              <TableHeader 
                onClick={() => handleSort('email')}
                sorted={sortField === 'email'}
                sortDirection={sortDirection}
              >Email</TableHeader>
              <TableHeader 
                onClick={() => handleSort('status')}
                sorted={sortField === 'status'}
                sortDirection={sortDirection}
              >Статус</TableHeader>
              <TableHeader 
                onClick={() => handleSort('computer_name')}
                sorted={sortField === 'computer_name'}
                sortDirection={sortDirection}
              >Ім'я комп'ютера</TableHeader>
              <TableHeader>Дії</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            {units.map(unit => (
              <TableRow key={unit.id}>
                <TableCell>{unit.name_of_unit || '—'}</TableCell>
                <TableCell>{unit.mil_unit}</TableCell>
                <TableCell>{unit.brigade_or_higher || '—'}</TableCell>
                <TableCell>{unit.email || '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={unit.status}>
                    {getStatusLabel(unit.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell>{unit.computer_name || '—'}</TableCell>
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
      
      {/* Add Unit Modal removed - now using global modal */}
      
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