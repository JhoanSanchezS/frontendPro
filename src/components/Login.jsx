import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const respuesta = await fetch('http://localhost:5000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correo.trim().toLowerCase(), password })
      });
      const datos = await respuesta.json();

      if (respuesta.ok) {
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        navigate('/menu');
      } else {
        setError(datos.mensaje || 'No fue posible validar tus datos.');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
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
          <span className="eyebrow">GESTIÓN INTELIGENTE DEL HOGAR</span>
          <h1>Entiende tu consumo. Decide mejor.</h1>
          <p>Una forma clara de organizar tus servicios y seguir el gasto de tu hogar, mes a mes.</p>
        </div>
        <div className="auth-brand-foot">AGUA <span /> ENERGÍA <span /> GAS</div>
      </section>

      <section className="auth-main">
        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="eyebrow">BIENVENIDO DE NUEVO</span>
            <h2>Iniciar sesión</h2>
            <p>Ingresa a tu espacio de control del hogar.</p>
          </div>

          {error && <div className="form-alert form-alert--error" role="alert">{error}</div>}

          <form onSubmit={handleLogin} className="form-stack">
            <div className="field-group">
              <label htmlFor="login-correo">Correo electrónico</label>
              <input
                id="login-correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="nombre@correo.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
              />
            </div>
            <button className="button-primary" type="submit">Entrar a PagoHogar <span aria-hidden="true">→</span></button>
          </form>

          <p className="auth-switch">¿Primera vez aquí? <Link to="/registro">Crear una cuenta</Link></p>
        </div>
        <footer className="auth-legal">PAGOHOGAR <span>·</span> CONTROL SIMPLE, HOGARES MÁS EFICIENTES</footer>
      </section>
    </main>
  );
};

export default Login;
