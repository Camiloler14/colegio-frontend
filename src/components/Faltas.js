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
          id_estudiante: estudianteId,
          fecha,
          descripcion
        });
      } else {
        await api.post('/faltas', {
          id_estudiante: estudianteId,
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
    setEstudianteId(falta.id_estudiante);
    setFecha(falta.fecha.slice(0, 10));
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
    <div className="contenedor-faltas">
      <style>{`
        .contenedor-faltas {
          margin-top: 20px;
          padding: 0 10px;
        }

        .center-mobile {
          display: flex;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .center-mobile {
            flex-direction: column;
            align-items: center;
          }

          form, .filtro-wrapper, .faltas-table-wrapper {
            width: 100%;
            max-width: 500px;
          }
        }

        .faltas-table-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .faltas-table {
          min-width: 600px;
          width: 100%;
          margin: 0 auto;
          border-collapse: collapse;
          background-color: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        .faltas-table th,
        .faltas-table td {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }

        @media (max-width: 768px) {
          .faltas-table thead {
            display: none;
          }

          .faltas-table,
          .faltas-table tr,
          .faltas-table td {
            display: block;
            width: 100%;
          }

          .faltas-table tr {
            margin-bottom: 10px;
            background: #f9f9f9;
            border-radius: 8px;
            padding: 10px;
          }

          .faltas-table td {
            display: flex;
            justify-content: space-between;
            padding: 8px 10px;
            border-bottom: none;
          }

          .faltas-table td::before {
            content: attr(data-label);
            font-weight: bold;
            color: #6200EA;
            flex-shrink: 0;
          }
        }
      `}</style>

      <h3 style={{ color: '#4A148C', marginBottom: '10px', textAlign: 'center' }}>📒 Faltas</h3>

      <div className="center-mobile">
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
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

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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
      </div>

      <div className="center-mobile filtro-wrapper" style={{ marginBottom: '20px' }}>
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

      <div className="center-mobile faltas-table-wrapper">
        <table className="faltas-table">
          <thead style={{ backgroundColor: '#6200EA', color: '#fff' }}>
            <tr>
              <th>Estudiante</th>
              <th>Grado</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {faltasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No hay faltas para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              faltasFiltradas.map(f => (
                <tr key={f.id}>
                  <td data-label="Estudiante">{f.nombre_estudiante}</td>
                  <td data-label="Grado">{f.grado}</td>
                  <td data-label="Fecha">{f.fecha.slice(0, 10)}</td>
                  <td data-label="Descripción">{f.descripcion}</td>
                  <td data-label="Acciones">
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
    </div>
  );
}

export default Faltas;




