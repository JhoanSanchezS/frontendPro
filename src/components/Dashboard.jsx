import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recibos, setRecibos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

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
      console.error("Error al cargar:", error);
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
        setMensaje({ texto: '¡Recibo eliminado correctamente!', tipo: 'exito' });
        setRecibos(recibos.filter(recibo => recibo._id !== id));
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
      } else {
        setMensaje({ texto: 'No se pudo eliminar el recibo.', tipo: 'error' });
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMensaje({ texto: 'No se pudo conectar con el servidor.', tipo: 'error' });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>Historial de Consumo</h2>
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
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#7f8c8d' }}>Cargando recibos...</p>
      ) : recibos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #bdc3c7' }}>
          <p style={{ fontSize: '18px', color: '#7f8c8d' }}>No has registrado ningún recibo aún.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
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
              {recibos.map((recibo) => (
                <tr key={recibo._id} style={{ borderBottom: '1px solid #ecf0f1', transition: 'background-color 0.2s' }}>
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
      )}
    </div>
  );
};

export default Dashboard;