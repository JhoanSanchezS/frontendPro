import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', correo: '', password: '' });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setMensaje({ texto: 'Creando tu cuenta…', tipo: 'info' });

    try {
      const respuesta = await fetch('http://localhost:5000/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, correo: formData.correo.trim().toLowerCase() })
      });
      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensaje({ texto: 'Cuenta creada. Te llevaremos al inicio de sesión.', tipo: 'success' });
        setTimeout(() => navigate('/'), 1600);
      } else {
        setMensaje({ texto: datos.mensaje || 'No fue posible crear la cuenta.', tipo: 'error' });
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setMensaje({ texto: 'No se pudo conectar con el servidor. Inténtalo de nuevo.', tipo: 'error' });
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-brand-panel">
        <Link className="brand-lockup" to="/" aria-label="PagoHogar, inicio">
          <span className="brand-mark">P</span>
          <span>PagoHogar</span>
        </Link>
        <div className="auth-brand-copy">
          <span className="eyebrow">UNA MEJOR VISIÓN DE TU HOGAR</span>
          <h1>Todo tu consumo, en un solo lugar.</h1>
          <p>Crea tu cuenta para registrar facturas, consultar tendencias y descubrir formas de ahorrar.</p>
        </div>
        <div className="auth-brand-foot">AGUA <span /> ENERGÍA <span /> GAS</div>
      </section>

      <section className="auth-main">
        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="eyebrow">EMPIEZA EN UN MOMENTO</span>
            <h2>Crear cuenta</h2>
            <p>Registra los datos de tu hogar para continuar.</p>
          </div>

          {mensaje.texto && (
            <div className={`form-alert form-alert--${mensaje.tipo}`} role={mensaje.tipo === 'error' ? 'alert' : 'status'}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleRegistro} className="form-stack">
            <div className="field-group">
              <label htmlFor="registro-nombre">Nombre o alias del hogar</label>
              <input
                id="registro-nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Casa de Alejo"
                autoComplete="name"
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="registro-correo">Correo electrónico</label>
              <input
                id="registro-correo"
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="nombre@correo.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="registro-password">Contraseña</label>
              <input
                id="registro-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crea una contraseña"
                autoComplete="new-password"
                required
              />
            </div>
            <button className="button-primary" type="submit">Crear cuenta <span aria-hidden="true">→</span></button>
          </form>

          <p className="auth-switch">¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link></p>
        </div>
        <footer className="auth-legal">PAGOHOGAR <span>·</span> CONTROL SIMPLE, HOGARES MÁS EFICIENTES</footer>
      </section>
    </main>
  );
};

export default Registro;
