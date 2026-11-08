import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { obtenerConsejo } from './MotorConcientizacion';

const opciones = [
  { ruta: '/registro-agua', nombre: 'Agua', detalle: 'Lecturas y factura mensual', codigo: '01', accent: 'water' },
  { ruta: '/registro-energia', nombre: 'Energía', detalle: 'Consumo eléctrico del hogar', codigo: '02', accent: 'energy' },
  { ruta: '/registro-gas', nombre: 'Gas', detalle: 'Uso y costo del servicio', codigo: '03', accent: 'gas' },
  { ruta: '/dashboard', nombre: 'Historial', detalle: 'Tendencias y registros', codigo: '04', accent: 'history' }
];

const MenuPrincipal = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [servicioConsejo, setServicioConsejo] = useState('Agua');
  const [consejo, setConsejo] = useState(() => obtenerConsejo('Agua'));

  useEffect(() => {
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
      navigate('/');
      return;
    }

    const usuarioGuardado = JSON.parse(usuarioString);
    setNombreUsuario(usuarioGuardado.nombre || 'Usuario');
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
    <div className="app-page">
      <header className="topbar">
        <Link className="brand-lockup brand-lockup--dark" to="/menu" aria-label="PagoHogar, menú principal">
          <span className="brand-mark">P</span>
          <span>PagoHogar</span>
        </Link>
        <div className="topbar-actions">
          <span className="account-chip"><span className="account-dot" />{nombreUsuario}</span>
          <button className="button-quiet" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </header>

      <main className="content-wrap">
        <section className="page-intro">
          <span className="eyebrow">PANEL DEL HOGAR</span>
          <h1>Consumo bajo control.</h1>
          <p>Hola, <strong>{nombreUsuario}</strong>. Consulta tus servicios o registra una nueva factura.</p>
        </section>

        <section className="workspace-section" aria-labelledby="servicios-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">GESTIÓN DE SERVICIOS</span>
              <h2 id="servicios-title">¿Qué deseas consultar?</h2>
            </div>
            <span className="section-note">Selecciona una opción para continuar</span>
          </div>

          <div className="menu-actions">
            {opciones.map((opcion) => (
              <Link
                key={opcion.ruta}
                to={opcion.ruta}
                className={`menu-action-card menu-action-card--${opcion.accent}`}
              >
                <span className="menu-action-card__topline">
                  <span className="menu-action-card__code">{opcion.codigo}</span>
                  <span className="menu-action-card__arrow" aria-hidden="true">↗</span>
                </span>
                <span className="menu-action-card__title">{opcion.nombre}</span>
                <span className="menu-action-card__hint">{opcion.detalle}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="consejo-card" aria-labelledby="titulo-consejos">
          <div className="consejo-card__intro">
            <span className="eyebrow">EFICIENCIA EN CASA</span>
            <h2 id="titulo-consejos">Una idea para ahorrar.</h2>
            <p>Pequeños hábitos pueden hacer una diferencia en tu consumo mensual.</p>
          </div>
          <div className="consejo-card__content">
            <div className="consejo-card__control">
              <label htmlFor="servicio-consejo">Servicio</label>
              <select
                id="servicio-consejo"
                value={servicioConsejo}
                onChange={(e) => cambiarServicioConsejo(e.target.value)}
              >
                <option value="Agua">Agua</option>
                <option value="Energía">Energía</option>
                <option value="Gas">Gas</option>
              </select>
            </div>
            <div className="consejo-card__message" aria-live="polite">
              <span className="consejo-card__quote-mark" aria-hidden="true">“</span>
              <p>{consejo}</p>
            </div>
            <button className="button-secondary" type="button" onClick={() => setConsejo(obtenerConsejo(servicioConsejo))}>
              Otro consejo <span aria-hidden="true">↻</span>
            </button>
          </div>
        </section>
      </main>
      <footer className="app-footer">PAGOHOGAR <span>·</span> GESTIÓN DE CONSUMO DEL HOGAR</footer>
    </div>
  );
};

export default MenuPrincipal;
