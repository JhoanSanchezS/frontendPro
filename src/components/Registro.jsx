import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setMensaje({ texto: 'Procesando...', tipo: 'info' });

try {
      const respuesta = await fetch('http://localhost:5000/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          correo: formData.correo.toLowerCase() // Convierte el correo a minúsculas
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensaje({ texto: '¡Cuenta creada! Volviendo al inicio...', tipo: 'exito' });
        // Esperamos 2 segundos y lo enviamos al login
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMensaje({ texto: datos.mensaje || 'Error al registrar', tipo: 'error' });
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setMensaje({ texto: 'No se pudo conectar con el servidor.', tipo: 'error' });
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
        Crear Cuenta 📝
      </h2>
      
      {mensaje.texto && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '20px', 
          borderRadius: '8px', 
          textAlign: 'center', 
          fontSize: '14px',
          backdropFilter: 'blur(4px)',
          backgroundColor: mensaje.tipo === 'exito' ? 'rgba(40, 167, 69, 0.8)' : mensaje.tipo === 'error' ? 'rgba(255, 77, 77, 0.8)' : 'rgba(255, 255, 255, 0.5)',
          color: 'white'
        }}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '500', fontSize: '14px', letterSpacing: '0.5px' }}>Nombre o Alias:</label>
          <input 
            type="text" 
            name="nombre"
            value={formData.nombre} 
            onChange={handleChange} 
            placeholder="Ej: Casa"
            required 
            style={{ 
              width: '100%', padding: '12px', borderRadius: '8px', border: 'none', 
              background: 'rgba(255, 255, 255, 0.9)', boxSizing: 'border-box', outline: 'none', fontSize: '15px'
            }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '500', fontSize: '14px', letterSpacing: '0.5px' }}>Correo Electrónico:</label>
          <input 
            type="email" 
            name="correo"
            value={formData.correo} 
            onChange={handleChange} 
            placeholder="ejemplo@correo.com"
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
            name="password"
            value={formData.password} 
            onChange={handleChange} 
            placeholder="••••••••"
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
          Registrarse
        </button>
      </form>

      <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px' }}>
        ¿Ya tienes cuenta? <Link to="/" style={{ color: '#a8e063', textDecoration: 'none', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>Inicia sesión aquí</Link>
      </div>
    </div>
  );
};

export default Registro;