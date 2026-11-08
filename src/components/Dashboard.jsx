import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recibos, setRecibos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  // Estado para filtrar la tabla
  const [filtroTabla, setFiltroTabla] = useState('Todos');
  
  // Estado exclusivo para la gráfica (Agua por defecto)
  const [servicioGrafica, setServicioGrafica] = useState('Agua');

  useEffect(() => {
    cargarRecibos();
  }, []);

  const cargarRecibos = async () => {
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
      navigate('/');
      return;
    }
    const usuarioGuardado = JSON.parse(usuarioString);

    try {
      const respuesta = await fetch('http://localhost:5000/api/consumo');
      const datos = await respuesta.json();

      if (respuesta.ok) {
        const recibosDelUsuario = datos.filter(recibo => 
          recibo.usuario === usuarioGuardado.id || 
          (recibo.usuario && recibo.usuario._id === usuarioGuardado.id)
        );
        setRecibos(recibosDelUsuario);
      } else {
        setMensaje({ texto: 'Error al cargar los recibos.', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error al cargar:', error);
      setMensaje({ texto: 'No se pudo conectar con el servidor.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const eliminarRecibo = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este recibo?');
    if (!confirmar) return;

    try {
      const respuesta = await fetch(`http://localhost:5000/api/consumo/${id}`, {
        method: 'DELETE'
      });

      if (respuesta.ok) {
        setMensaje({ texto: 'Recibo eliminado correctamente.', tipo: 'exito' });
        setRecibos(recibos.filter(recibo => recibo._id !== id));
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
      } else {
        setMensaje({ texto: 'No se pudo eliminar el recibo.', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      setMensaje({ texto: 'No se pudo conectar con el servidor.', tipo: 'error' });
    }
  };

  // Procesar datos para la gráfica: un solo servicio ordenado mes a mes
  const datosGraficaServicio = useMemo(() => {
    const agrupadoPorMes = {};

    recibos.forEach(recibo => {
      if (recibo.tipoServicio === servicioGrafica) {
        const mes = recibo.mesRegistrado;
        if (!agrupadoPorMes[mes]) {
          agrupadoPorMes[mes] = { mes, totalPagado: 0 };
        }
        agrupadoPorMes[mes].totalPagado += Number(recibo.costoFactura) || 0;
      }
    });

    // Ordenar cronológicamente los meses
    return Object.values(agrupadoPorMes).sort((a, b) => a.mes.localeCompare(b.mes));
  }, [recibos, servicioGrafica]);

  // Color de barra dinámico según el servicio activo
  const colorBarra = useMemo(() => {
    switch (servicioGrafica) {
      case 'Agua': return '#3498db';
      case 'Energía': return '#f1c40f';
      case 'Gas': return '#e67e22';
      default: return '#2c3e50';
    }
  }, [servicioGrafica]);

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>Panel de Control y Consumo</h2>
        <Link to="/menu" style={{ padding: '10px 15px', backgroundColor: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          Volver al Menú
        </Link>
      </div>

      {mensaje.texto && (
        <div style={{ 
          padding: '12px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold',
          backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
          color: mensaje.tipo === 'exito' ? '#155724' : '#721c24'
        }}>
          {mensaje.texto}
        </div>
      )}

      {cargando ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#7f8c8d' }}>Cargando información...</p>
      ) : recibos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #bdc3c7' }}>
          <p style={{ fontSize: '18px', color: '#7f8c8d' }}>No has registrado ningún recibo aún.</p>
        </div>
      ) : (
        <>
          {/* SECCIÓN INDEPENDIENTE DE GRÁFICAS */}
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', marginBottom: '35px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '18px' }}>
                  Evolución Mensual: <span style={{ color: colorBarra }}>{servicioGrafica}</span>
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#7f8c8d' }}>
                  Comparación del costo de {servicioGrafica.toLowerCase()} mes a mes
                </p>
              </div>

              {/* Selector de servicio para la gráfica */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontWeight: 'bold', color: '#34495e', fontSize: '14px' }}>
                  Ver gráfica de:
                </label>
                <select
                  value={servicioGrafica}
                  onChange={(e) => setServicioGrafica(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '2px solid ' + colorBarra,
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="Agua">Agua 💧</option>
                  <option value="Energía">Energía ⚡</option>
                  <option value="Gas">Gas 🔥</option>
                </select>
              </div>
            </div>

            {/* Contenedor de la Gráfica */}
            <div style={{ width: '100%', height: 300 }}>
              {datosGraficaServicio.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#95a5a6' }}>
                  No hay registros de {servicioGrafica} para mostrar en la gráfica.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosGraficaServicio} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="mes" tick={{ fill: '#7f8c8d', fontSize: 13 }} />
                    <YAxis tick={{ fill: '#7f8c8d', fontSize: 13 }} tickFormatter={(valor) => `$${(valor / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(valor) => [`$${valor.toLocaleString('es-CO')}`, `Costo ${servicioGrafica}`]}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="totalPagado" name={`Costo (${servicioGrafica})`} fill={colorBarra} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* SECCIÓN INDEPENDIENTE DE TABLA */}
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ margin: 0, color: '#34495e', fontSize: '18px' }}>Historial Completo de Recibos</h3>
              
              {/* Filtro para la tabla */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontWeight: 'bold', color: '#34495e', fontSize: '14px' }}>
                  Filtrar tabla:
                </label>
                <select
                  value={filtroTabla}
                  onChange={(e) => setFiltroTabla(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #bdc3c7',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Todos">Todos</option>
                  <option value="Agua">Agua</option>
                  <option value="Energía">Energía</option>
                  <option value="Gas">Gas</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Mes</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Servicio</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Consumo</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Total Pagado</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {recibos
                    .filter((recibo) => filtroTabla === 'Todos' || recibo.tipoServicio === filtroTabla)
                    .map((recibo) => (
                    <tr key={recibo._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                      <td style={{ padding: '15px', color: '#34495e', fontWeight: '500' }}>{recibo.mesRegistrado}</td>
                      
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                          backgroundColor: recibo.tipoServicio === 'Agua' ? '#d4f1f9' : recibo.tipoServicio === 'Energía' ? '#fff3cd' : '#f8d7da',
                          color: recibo.tipoServicio === 'Agua' ? '#0c5460' : recibo.tipoServicio === 'Energía' ? '#856404' : '#721c24'
                        }}>
                          {recibo.tipoServicio}
                        </span>
                      </td>
                      
                      <td style={{ padding: '15px', color: '#7f8c8d' }}>{recibo.cantidadConsumida}</td>
                      
                      <td style={{ padding: '15px', fontWeight: 'bold', color: '#27ae60' }}>
                        ${recibo.costoFactura.toLocaleString('es-CO')}
                      </td>
                      
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <button 
                          onClick={() => eliminarRecibo(recibo._id)}
                          style={{ 
                            backgroundColor: '#e74c3c', color: 'white', border: 'none', cursor: 'pointer', 
                            fontSize: '13px', padding: '8px 12px', borderRadius: '5px', fontWeight: 'bold',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;