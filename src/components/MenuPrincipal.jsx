import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const MenuPrincipal = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
      navigate('/');
    } else {
      const usuarioGuardado = JSON.parse(usuarioString);
      setNombreUsuario(usuarioGuardado.nombre || 'Usuario');
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      width: '90%',
      margin: '40px auto',
      padding: '40px', 
      background: 'rgba(255, 255, 255, 0.15)', 
      backdropFilter: 'blur(12px)', 
      WebkitBackdropFilter: 'blur(12px)', 
      borderRadius: '20px', 
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      color: '#ffffff',
      textAlign: 'center'
    }}>
      <h1 style={{ marginBottom: '10px', fontSize: '32px', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        PagoHogar
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '30px', color: '#e8f6f3' }}>
        ¡Hola, <strong>{nombreUsuario}</strong>! ¿Qué deseas hacer hoy?
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        
        <Link to="/registro-agua" style={{ textDecoration: 'none' }}>
          <div style={botonStyle('#3498db')}>
            Registrar Agua
          </div>
        </Link>

        <Link to="/registro-energia" style={{ textDecoration: 'none' }}>
          <div style={botonStyle('#f1c40f')}>
            Registrar Energía
          </div>
        </Link>

        <Link to="/registro-gas" style={{ textDecoration: 'none' }}>
          <div style={botonStyle('#e67e22')}>
            Registrar Gas
          </div>
        </Link>

        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={botonStyle('#9b59b6')}>
            Ver Historial
          </div>
        </Link>

      </div>

      <button 
        onClick={cerrarSesion}
        style={{ 
          padding: '12px 25px', 
          backgroundColor: 'rgba(231, 76, 60, 0.8)', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer', 
          fontSize: '16px', 
          fontWeight: 'bold',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(231, 76, 60, 1)'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.8)'}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

const botonStyle = (colorBorde) => ({
  padding: '25px 15px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#2c3e50',
  borderRadius: '12px',
  fontWeight: 'bold',
  fontSize: '16px',
  borderBottom: `4px solid ${colorBorde}`,
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  cursor: 'pointer'
});

export default MenuPrincipal;