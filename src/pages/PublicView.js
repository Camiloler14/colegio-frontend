import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PublicView() {
  const [faltas, setFaltas] = useState([]);
  const [gradoFiltro, setGradoFiltro] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');

  useEffect(() => {
    fetchFaltas();
  }, []);

  const fetchFaltas = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/faltas`);
      setFaltas(res.data);
    } catch (error) {
      console.error('Error al cargar faltas:', error);
    }
  };

  const formatFecha = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0]; // formato yyyy-mm-dd
  };

  const faltasFiltradas = faltas.filter((f) => {
    const cumpleGrado = gradoFiltro ? f.grado === gradoFiltro : true;
    const cumpleFecha = fechaFiltro ? formatFecha(f.fecha) === fechaFiltro : true;
    return cumpleGrado && cumpleFecha;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        ❌ Estudiantes con Faltas
      </h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <label>
          Filtrar por grado:
          <select
            value={gradoFiltro}
            onChange={e => setGradoFiltro(e.target.value)}
            style={{ marginLeft: '8px', padding: '6px', borderRadius: '6px' }}
          >
            <option value="">Todos</option>
            {[...Array(11)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filtrar por fecha:
          <input
            type="date"
            value={fechaFiltro}
            onChange={e => setFechaFiltro(e.target.value)}
            style={{ marginLeft: '8px', padding: '6px', borderRadius: '6px' }}
          />
        </label>

        <button
          onClick={fetchFaltas}
          style={{
            marginLeft: 'auto',
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: '#6200EA',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          title="Actualizar lista"
        >
          Actualizar
        </button>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <thead style={{ backgroundColor: '#6200EA', color: '#fff' }}>
          <tr>
            <th style={{ padding: '10px', textAlign: 'center' }}>Estudiante</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Grado</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Fecha</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {faltasFiltradas.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>
                No hay faltas para los filtros seleccionados.
              </td>
            </tr>
          ) : (
            faltasFiltradas.map((falta) => (
              <tr key={falta.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                  {falta.nombre_estudiante}
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                  {falta.grado}
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                  {formatFecha(falta.fecha)}
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                  {falta.descripcion}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PublicView;



