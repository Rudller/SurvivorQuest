import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import Realization from './pages/Realization';
import AddRealization from './pages/AddRealization';
import ManageGames from './pages/ManageGames';
import AddGame from './pages/AddGame';
import AddGameTemplate from './pages/AddGameTemplate';
import EditGameTemplate from './pages/EditGameTemplate';
import EditRealization from './pages/EditRealization';
import EditRealizationGames from './pages/EditRealizationGames';
import './index.css';

// Dummy auth check (replace with real logic)
const isAuthenticated = () => {
  // Sprawdza, czy token JWT jest w localStorage
  return Boolean(localStorage.getItem('token'));
};

function RequireAuth({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Przykład: chroniona strona główna */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/realization" element={
          <RequireAuth>
            <Realization />
          </RequireAuth>
        } />
        <Route path="/editrealization/:id" element={
          <RequireAuth>
            <EditRealization />
          </RequireAuth>
        } />
        <Route path="/addrealization" element={
          <RequireAuth>
            <AddRealization />
          </RequireAuth>
        } />
        <Route path="/managegames" element={
          <RequireAuth>
            <ManageGames />
          </RequireAuth>
        } />
        <Route path="/addgame" element={
          <RequireAuth>
            <AddGame />
          </RequireAuth>
        } />
        <Route path="/addgametemplate" element={
          <RequireAuth>
            <AddGameTemplate />
          </RequireAuth>
        } />
        <Route path="/editgametemplate/:id" element={
          <RequireAuth>
            <EditGameTemplate />
          </RequireAuth>
        } />
        <Route path="/editrealization/:id/games" element={
          <RequireAuth>
            <EditRealizationGames />
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
