import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Provider } from 'react-redux';
import { store } from './store';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import UnitDetailPage from './pages/UnitDetailPage';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';

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
            <StyledLink to="/">Головна</StyledLink>
            <StyledLink to="/dashboard">Панель керування</StyledLink>
          </NavLinks>
        </Nav>
      </Header>
      
      <Main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/units/:id" element={<UnitDetailPage />} />
        </Routes>
      </Main>
      
      <Footer>
        &copy; {new Date().getFullYear()} AD-tracker - Система відслідковування військових підрозділів
      </Footer>
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