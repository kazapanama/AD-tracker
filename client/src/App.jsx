import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { clearFilters } from './store/slices/unitSlice';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import UnitDetailPage from './pages/UnitDetailPage';
import StatisticsPage from './pages/StatisticsPage';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import FloatingAddButton from './components/FloatingAddButton';
import AddUnitModal from './components/AddUnitModal';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: #4b0082;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  color: #fff;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Footer = styled.footer`
  background-color: #4b0082;
  color: white;
  padding: 1rem;
  text-align: center;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 250px;
  margin-right: 1rem;

  @media (max-width: 768px) {
    width: 180px;
  }
`;

const AppContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Function to clear filters when navigating to dashboard from header
  const clearFiltersOnNavigation = (path) => {
    // Clear filters in Redux
    dispatch(clearFilters());
    
    // Navigate programmatically instead of relying on the Link component
    navigate(path);
    
    // Prevent default navigation
    return false;
  };
  
  // Check if URL hash is #add-unit to show the modal
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#add-unit') {
        setIsAddModalOpen(true);
        // Clear hash after opening modal
        setTimeout(() => {
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
        }, 0);
      }
    };

    // Check on mount and URL changes
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [location]);
  
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };
  
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };
  
  return (
    <AppContainer>
      <Header>
        <Nav>
          <LogoLink to="/">
            <Logo>AD-tracker</Logo>
          </LogoLink>
          <NavLinks>
            <SearchContainer>
              <SearchBar inHeader={true} />
              <SearchResults />
            </SearchContainer>
            <StyledLink to="#" onClick={(e) => { e.preventDefault(); clearFiltersOnNavigation('/dashboard'); }}>Панель керування</StyledLink>
            <StyledLink to="/statistics">Статистика</StyledLink>
          </NavLinks>
        </Nav>
      </Header>
      
      <Main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/units/:id" element={<UnitDetailPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>
      </Main>
      
      <Footer>
        &copy; {new Date().getFullYear()} AD-tracker 
      </Footer>
      
      {/* Floating Add Button */}
      <FloatingAddButton onClick={handleOpenAddModal} />
      
      {/* Global Add Unit Modal */}
      <AddUnitModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
    </AppContainer>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;