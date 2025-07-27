import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';

function Estudiantes({ onCambio }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [grado, setGrado] = useState('');
  const [editando, setEditando] = useState(null);
  const [gradoFiltro, setGradoFiltro] = useState(localStorage.getItem('gradoFiltro') || '');

  const obtenerEstudiantes = async () => {
    try {
      const res = await api.get('/estudiantes');
      setEstudiantes(res.data);
    } catch (err) {
      console.error('Error al obtener estudiantes:', err);
    }
  };

  useEffect(() => {
    obtenerEstudiantes();
  }, []);

  const manejarFiltroGrado = (valor) => {
    setGradoFiltro(valor);
    localStorage.setItem('gradoFiltro', valor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !grado) return;

    try {
      if (editando) {
        await api.put(`/estudiantes/${editando}`, { nombre, grado });
      } else {
        await api.post('/estudiantes', { nombre, grado });
      }

      setNombre('');
      setGrado('');
      setEditando(null);
     await obtenerEstudiantes();
      if (onCambio) onCambio();
    } catch (err) {
      console.error('Error al guardar estudiante:', err);
    }
  };

  const editarEstudiante = (estudiante) => {
    setNombre(estudiante.nombre);
    setGrado(estudiante.grado);
    setEditando(estudiante.id);
  };

  const eliminarEstudiante = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este estudiante?')) return;
    try {
      await api.delete(`/estudiantes/${id}`);
     await obtenerEstudiantes();
      if (onCambio) onCambio(); 
    } catch (err) {
      console.error('Error al eliminar estudiante:', err);
    }
  };

  const estudiantesFiltrados = gradoFiltro
    ? estudiantes.filter((est) => est.grado === gradoFiltro)
    : estudiantes;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#1565C0', marginBottom: '10px' }}>📘 Estudiantes</h3>

      <form onSubmit={handleSubmit} style={{
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '6px' }}
        />
        <input
          type="text"
          placeholder="Grado"
          value={grado}
          onChange={(e) => setGrado(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '6px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: editando ? '#FFB300' : '#1976D2',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}>
            {editando ? 'Actualizar' : 'Agregar'}
          </button>
          {editando && (
            <button
              type="button"
              onClick={() => {
                setNombre('');
                setGrado('');
                setEditando(null);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#9E9E9E',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Filtrar por grado: </label>
        <select
          value={gradoFiltro}
          onChange={(e) => manejarFiltroGrado(e.target.value)}
          style={{ padding: '6px', borderRadius: '6px', marginLeft: '10px' }}
        >
          <option value="">Todos</option>
          {[...Array(11)].map((_, i) => (
            <option key={i + 1} value={String(i + 1)}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
<table style={{
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  borderRadius: '8px',
  overflow: 'hidden',
  tableLayout: 'fixed'
}}>
  <thead style={{ backgroundColor: '#0D47A1', color: '#fff' }}>
    <tr>
      <th style={{ padding: '10px', textAlign: 'left', width: '40%' }}>Nombre</th>
      <th style={{ padding: '10px', textAlign: 'left', width: '20%' }}>Grado</th>
      <th style={{ padding: '10px', textAlign: 'left', width: '40%' }}>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {estudiantesFiltrados.map((est) => (
      <tr key={est.id}>
        <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'left' }}>{est.nombre}</td>
        <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'left' }}>{est.grado}</td>
        <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'left' }}>
          <button onClick={() => editarEstudiante(est)} style={{
            marginRight: '10px',
            backgroundColor: '#03A9F4',
            border: 'none',
            padding: '6px 10px',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Editar
          </button>
          <button onClick={() => eliminarEstudiante(est.id)} style={{
            backgroundColor: '#E53935',
            border: 'none',
            padding: '6px 10px',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Eliminar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}

export default Estudiantes;
