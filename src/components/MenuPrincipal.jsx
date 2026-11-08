import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { obtenerConsejo } from './MotorConcientizacion';

const MenuPrincipal = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [servicioConsejo, setServicioConsejo] = useState('Agua');
  const [consejo, setConsejo] = useState(() => obtenerConsejo('Agua'));

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

  const cambiarServicioConsejo = (servicio) => {
    setServicioConsejo(servicio);
    setConsejo(obtenerConsejo(servicio));
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

      <div className="menu-actions">
        <Link to="/registro-agua" className="menu-action-card" style={{ '--card-accent': '#61c8f2' }}>
          <span className="menu-action-card__icon">💧</span>
          <span className="menu-action-card__title">Registrar Agua</span>
          <span className="menu-action-card__hint">Controla tu consumo</span>
        </Link>

        <Link to="/registro-energia" className="menu-action-card" style={{ '--card-accent': '#f7d45b' }}>
          <span className="menu-action-card__icon">⚡</span>
          <span className="menu-action-card__title">Registrar Energía</span>
          <span className="menu-action-card__hint">Anota tu factura</span>
        </Link>

        <Link to="/registro-gas" className="menu-action-card" style={{ '--card-accent': '#ffad72' }}>
          <span className="menu-action-card__icon">🔥</span>
          <span className="menu-action-card__title">Registrar Gas</span>
          <span className="menu-action-card__hint">Lleva el seguimiento</span>
        </Link>

        <Link to="/dashboard" className="menu-action-card" style={{ '--card-accent': '#d1a1ff' }}>
          <span className="menu-action-card__icon">📊</span>
          <span className="menu-action-card__title">Ver Historial</span>
          <span className="menu-action-card__hint">Revisa tus registros</span>
        </Link>
      </div>

      <section className="consejo-card" aria-labelledby="titulo-consejos">
        <div className="consejo-card__encabezado">
          <span className="consejo-card__icono" aria-hidden="true">🌱</span>
          <div>
            <span className="consejo-card__etiqueta">PEQUEÑOS CAMBIOS, GRAN IMPACTO</span>
            <h2 id="titulo-consejos">Consejos para ahorrar</h2>
          </div>
        </div>
        <label className="consejo-card__label" htmlFor="servicio-consejo">Consejos para:</label>
        <select
          className="consejo-card__select"
          id="servicio-consejo"
          value={servicioConsejo}
          onChange={(e) => cambiarServicioConsejo(e.target.value)}
        >
          <option value="Agua">Agua 💧</option>
          <option value="Energía">Energía ⚡</option>
          <option value="Gas">Gas 🔥</option>
        </select>
        <div className="consejo-card__mensaje" aria-live="polite">
          <span className="consejo-card__comilla" aria-hidden="true">“</span>
          <p>{consejo}</p>
        </div>
        <button
          className="consejo-card__boton"
          type="button"
          onClick={() => setConsejo(obtenerConsejo(servicioConsejo))}
        >
          <span aria-hidden="true">↻</span> Ver otro consejo
        </button>
      </section>

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

export default MenuPrincipal;
