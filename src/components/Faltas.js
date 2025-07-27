import React, { useEffect, useState } from 'react';
import api from '../axiosConfig';

function Faltas({ actualizar }) {
  const [faltas, setFaltas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteId, setEstudianteId] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editando, setEditando] = useState(null);
  const [gradoFiltro, setGradoFiltro] = useState(localStorage.getItem('gradoFiltroFaltas') || '');

  useEffect(() => {
    obtenerEstudiantes();
  }, []);

  useEffect(() => {
    obtenerFaltas();
  }, [actualizar]);

  const obtenerEstudiantes = async () => {
    try {
      const res = await api.get('/estudiantes');
      setEstudiantes(res.data);
    } catch (err) {
      console.error('Error al obtener estudiantes:', err);
    }
  };

  const obtenerFaltas = async () => {
    try {
      const res = await api.get('/faltas');
      setFaltas(res.data);
    } catch (err) {
      console.error('Error al obtener faltas:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!estudianteId || !fecha || !descripcion) return;

    try {
      if (editando) {
        await api.put(`/faltas/${editando}`, {
          estudiante_id: estudianteId,
          fecha,
          descripcion
        });
      } else {
        await api.post('/faltas', {
          estudiante_id: estudianteId,
          fecha,
          descripcion
        });
      }
      setEstudianteId('');
      setFecha('');
      setDescripcion('');
      setEditando(null);
      obtenerFaltas();
    } catch (err) {
      console.error('Error al guardar falta:', err);
    }
  };

  const editarFalta = (falta) => {
    setEstudianteId(falta.estudiante_id);
    setFecha(falta.fecha.split('T')[0]);
    setDescripcion(falta.descripcion);
    setEditando(falta.id);
  };

  const eliminarFalta = async (id) => {
    if (!window.confirm('¿Eliminar esta falta?')) return;
    try {
      await api.delete(`/faltas/${id}`);
      obtenerFaltas();
    } catch (err) {
      console.error('Error al eliminar falta:', err);
    }
  };

  const manejarFiltro = (valor) => {
    setGradoFiltro(valor);
    localStorage.setItem('gradoFiltroFaltas', valor);
  };

  const faltasFiltradas = gradoFiltro
    ? faltas.filter(f => f.grado === gradoFiltro)
    : faltas;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#4A148C', marginBottom: '10px' }}>📒 Faltas</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <select
          value={estudianteId}
          onChange={e => setEstudianteId(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '6px' }}
        >
          <option value="">Seleccione un estudiante</option>
          {estudiantes.map(est => (
            <option key={est.id} value={est.id}>{est.nombre}</option>
          ))}
        </select>

        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '6px' }}
        />

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '6px' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: editando ? '#FFB300' : '#4CAF50',
              color: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {editando ? 'Actualizar' : 'Registrar'}
          </button>

          {editando && (
            <button
              type="button"
              onClick={() => {
                setEstudianteId('');
                setFecha('');
                setDescripcion('');
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
          onChange={e => manejarFiltro(e.target.value)}
          style={{ padding: '6px', borderRadius: '6px', marginLeft: '10px' }}
        >
          <option value="">Todos</option>
          {[...Array(11)].map((_, i) => (
            <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
          ))}
        </select>
        <button
          onClick={() => manejarFiltro('')}
          style={{
            marginLeft: '10px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: '#ccc',
            border: 'none',
            cursor: 'pointer',
          }}
          title="Limpiar filtro"
        >
          Limpiar filtro
        </button>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <thead style={{ backgroundColor: '#6200EA', color: '#fff' }}>
          <tr>
            <th style={{ padding: '10px' }}>Estudiante</th>
            <th style={{ padding: '10px' }}>Grado</th>
            <th style={{ padding: '10px' }}>Fecha</th>
            <th style={{ padding: '10px' }}>Descripción</th>
            <th style={{ padding: '10px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {faltasFiltradas.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: '10px', textAlign: 'center' }}>
                No hay faltas para los filtros seleccionados.
              </td>
            </tr>
          ) : (
            faltasFiltradas.map(f => (
              <tr key={f.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{f.nombre_estudiante}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{f.grado}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{new Date(f.fecha).toLocaleDateString()}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{f.descripcion}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <button
                    onClick={() => editarFalta(f)}
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#03A9F4',
                      border: 'none',
                      padding: '6px 10px',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarFalta(f.id)}
                    style={{
                      backgroundColor: '#E53935',
                      border: 'none',
                      padding: '6px 10px',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Faltas;
