import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import PublicView from './pages/PublicView';

function App() {
  // Función que valida rol y sesión en tiempo real
  const esRolValido = () => {
    // Intenta obtener rol y sesionInicio desde localStorage o sessionStorage
    const rol = localStorage.getItem('rol') || sessionStorage.getItem('rol');
    const sesionInicio = localStorage.getItem('sesionInicio') || sessionStorage.getItem('sesionInicio');

    if (rol === 'admin' && sesionInicio) {
      const ahora = new Date().getTime();
      const inicio = parseInt(sesionInicio, 10);
      const duracionMaxima = 30 * 60 * 1000; // 30 minutos en ms

      if (ahora - inicio <= duracionMaxima) {
        return true;
      } else {
        // Sesión vencida: limpia todo
        localStorage.clear();
        sessionStorage.clear();
        return false;
      }
    }
    return false;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={esRolValido() ? <AdminPanel /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
