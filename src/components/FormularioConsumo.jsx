import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FormularioConsumo = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Esto nos dice en qué ruta estamos

  // 1. LÓGICA PARA DETECTAR EL SERVICIO Y SU UNIDAD DE MEDIDA
  let servicioActual = 'Agua';
  let unidadMedida = 'm³ (Metros cúbicos)';
  let colorAcento = '#3498db'; // Azul por defecto (Agua)

  if (location.pathname.includes('energia')) {
    servicioActual = 'Energía';
    unidadMedida = 'kWh (Kilovatios hora)';
    colorAcento = '#f1c40f'; // Amarillo para energía
  } else if (location.pathname.includes('gas')) {
    servicioActual = 'Gas';
    unidadMedida = 'm³ (Metros cúbicos)';
    colorAcento = '#e67e22'; // Naranja para gas
  }

  const [formData, setFormData] = useState({
    tipoServicio: servicioActual,
    cantidadConsumida: '',
    costoFactura: '',
    mesRegistrado: ''
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Si el usuario cambia de página, actualizamos el servicio oculto
  useEffect(() => {
    setFormData(prev => ({ ...prev, tipoServicio: servicioActual }));
  }, [servicioActual]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: 'Guardando recibo...', tipo: 'info' });

    const usuarioString = localStorage.getItem('usuario');
    
    if (!usuarioString) {
      setMensaje({ texto: 'Error: Debes iniciar sesión primero.', tipo: 'error' });
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    const usuarioGuardado = JSON.parse(usuarioString);

    const datosAEnviar = {
      ...formData,
      usuario: usuarioGuardado.id
    };

    try {
      const respuesta = await fetch('http://localhost:5000/api/consumo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar),
      });

      if (respuesta.ok) {
        setMensaje({ texto: 'Recibo guardado exitosamente.', tipo: 'exito' });
        // Limpiamos los campos numéricos y de fecha, pero mantenemos el servicio
        setFormData({ tipoServicio: servicioActual, cantidadConsumida: '', costoFactura: '', mesRegistrado: '' });
      } else {
        setMensaje({ texto: 'Hubo un error al guardar los datos.', tipo: 'error' });
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje({ texto: 'No se pudo conectar con el servidor.', tipo: 'error' });
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      
      {/* Título dinámico que cambia según el servicio */}
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>
        Registrar Recibo de {servicioActual}
      </h2>
      
      {mensaje.texto && (
        <div style={{ 
          padding: '10px', marginBottom: '15px', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold',
          backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : mensaje.tipo === 'error' ? '#f8d7da' : '#e2e3e5',
          color: mensaje.tipo === 'exito' ? '#155724' : mensaje.tipo === 'error' ? '#721c24' : '#383d41'
        }}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* Desaparecimos el select. Ahora es automático según el botón que presionaste */}

        <label style={{ fontWeight: 'bold', color: '#34495e' }}>
          Cantidad consumida en el mes ({unidadMedida}):
          <input 
            type="number" 
            step="any" 
            name="cantidadConsumida" 
            value={formData.cantidadConsumida} 
            onChange={handleChange} 
            placeholder="Ej: 120"
            required 
            style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '6px', border: `1px solid ${colorAcento}`, boxSizing: 'border-box' }} 
          />
        </label>

        <label style={{ fontWeight: 'bold', color: '#34495e' }}>
          Valor total a pagar ($):
          <input 
            type="number" 
            name="costoFactura" 
            value={formData.costoFactura} 
            onChange={handleChange} 
            placeholder="Ej: 45000"
            required 
            style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '6px', border: '1px solid #bdc3c7', boxSizing: 'border-box' }} 
          />
        </label>

        <label style={{ fontWeight: 'bold', color: '#34495e' }}>
          Mes facturado:
          <input 
            type="month" 
            name="mesRegistrado" 
            value={formData.mesRegistrado} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '6px', border: '1px solid #bdc3c7', boxSizing: 'border-box' }} 
          />
        </label>

        <button 
          type="submit" 
          style={{ 
            padding: '14px', backgroundColor: colorAcento, color: colorAcento === '#f1c40f' ? '#2c3e50' : 'white', 
            border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' 
          }}
        >
          Guardar Registro
        </button>
        
        <button 
          type="button" 
          onClick={() => navigate('/menu')} 
          style={{ padding: '12px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          Volver al Menú
        </button>
      </form>
    </div>
  );
};

export default FormularioConsumo;