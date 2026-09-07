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
        body: JSON.stringify({ correo, password }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // 👇 AQUÍ GUARDAMOS EL USUARIO EN LA MEMORIA DEL NAVEGADOR
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        
        navigate('/menu');
      } else {
        setError(datos.mensaje || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      width: '90%',
      padding: '40px', 
      background: 'rgba(255, 255, 255, 0.15)', 
      backdropFilter: 'blur(12px)', 
      WebkitBackdropFilter: 'blur(12px)', 
      borderRadius: '20px', 
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      color: '#ffffff'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '28px', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        Iniciar Sesión
      </h2>
      
      {error && (
        <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: 'rgba(255, 77, 77, 0.8)', color: 'white', borderRadius: '8px', textAlign: 'center', fontSize: '14px', backdropFilter: 'blur(4px)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '500', fontSize: '14px', letterSpacing: '0.5px' }}>Correo Electrónico:</label>
          <input 
            type="email" 
            value={correo} 
            onChange={(e) => setCorreo(e.target.value)} 
            placeholder="ejemplo@correo.com"
            autoComplete="off"
            required 
            style={{ 
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none', 
              background: 'rgba(255, 255, 255, 0.9)', boxSizing: 'border-box', outline: 'none', fontSize: '15px'
            }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '500', fontSize: '14px', letterSpacing: '0.5px' }}>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            autoComplete="new-password"
            required 
            style={{ 
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none', 
              background: 'rgba(255, 255, 255, 0.9)', boxSizing: 'border-box', outline: 'none', fontSize: '15px'
            }} 
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            padding: '14px', background: 'linear-gradient(90deg, #57ca85, #2980b9)', 
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', 
            fontSize: '16px', fontWeight: 'bold', marginTop: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Entrar al Sistema
        </button>
      </form>

      <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px' }}>
        ¿No tienes cuenta? <Link to="/registro" style={{ color: '#a8e063', textDecoration: 'none', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>Regístrate aquí</Link>
      </div>
    </div>
  );
};

export default Login;