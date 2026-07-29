import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [mensajeBackend, setMensajeBackend] = useState('');

  useEffect(() => {
    // Hacemos una petición a la ruta que creamos en el backend
    fetch('http://localhost:5000/api/prueba')
      .then(respuesta => respuesta.json())
      .then(datos => setMensajeBackend(datos.mensaje))
      .catch(error => console.error('Error conectando al backend:', error));
  }, []);

  return (
    <div>
      <h1>Mi Proyecto React + Vite</h1>
      <div className="card">
        <h2>Respuesta de la Base de Datos/Backend:</h2>
        {/* Aquí mostramos el mensaje que viene del backend */}
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          {mensajeBackend ? mensajeBackend : 'Cargando...'}
        </p>
      </div>
    </div>
  )
}

export default App