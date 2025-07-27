hacer responsive : import React, { useEffect, useState } from 'react';
import Estudiantes from '../components/Estudiantes';
import Faltas from '../components/Faltas';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [actualizarFaltas, setActualizarFaltas] = useState(false);

  const triggerActualizarFaltas = () => {
    setActualizarFaltas(prev => !prev);
  };

  useEffect(() => {
    const nombreGuardado =
      localStorage.getItem('nombre') || sessionStorage.getItem('nombre') || 'Administrador';
    setNombre(nombreGuardado);
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const refrescarPagina = () => {
    window.location.reload();
  };

  return (
    <div style={backgroundStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#222' }}>🤗{nombre}</h2>
        <div>
          <button onClick={refrescarPagina} style={{...cerrarButtonStyle, marginRight: '10px', backgroundColor: '#1976D2'}}>
            Actualizar
          </button>
          <button onClick={cerrarSesion} style={cerrarButtonStyle}>
            Cerrar sesión
          </button>
        </div>
      </div>
      <p style={{ color: '#444' }}>Aquí podrás gestionar estudiantes y faltas.</p>
      <hr style={{ margin: '20px 0' }} />

      <div style={panelStyle}>
        <div style={cardStyle}>
          <Estudiantes onEstudianteGuardado={triggerActualizarFaltas} />
        </div>
        <div style={cardStyle}>
          <Faltas actualizar={actualizarFaltas} />
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#ffffffcc',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  flex: 1,
  minWidth: '300px',
  backdropFilter: 'blur(5px)'
};

const panelStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '40px',
  alignItems: 'flex-start',
  marginTop: '20px'
};

const backgroundStyle = {
  padding: '30px',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #c3ecf5, #e8d4f7)',
  backgroundAttachment: 'fixed',
  color: '#333'
};

const cerrarButtonStyle = {
  backgroundColor: '#E53935',
  color: 'white',
  padding: '10px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default AdminPanel;

