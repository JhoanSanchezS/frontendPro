import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { obtenerConsejo } from './MotorConcientizacion';

const FormularioConsumo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ tipoServicio: 'Agua', cantidadConsumida: '', costoFactura: '', mesRegistrado: '' });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const servicioActual = location.pathname.includes('energia')
    ? 'Energía'
    : location.pathname.includes('gas')
      ? 'Gas'
      : 'Agua';
  const unidadMedida = servicioActual === 'Energía' ? 'kWh' : 'm³';

  useEffect(() => {
    setFormData((prev) => ({ ...prev, tipoServicio: servicioActual }));
  }, [servicioActual]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: 'Guardando recibo…', tipo: 'info' });

    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
      setMensaje({ texto: 'Inicia sesión para registrar un recibo.', tipo: 'error' });
      setTimeout(() => navigate('/'), 1600);
      return;
    }

    try {
      const usuarioGuardado = JSON.parse(usuarioString);
      const respuesta = await fetch('http://localhost:5000/api/consumo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, usuario: usuarioGuardado.id })
      });

      if (respuesta.ok) {
        const consejo = obtenerConsejo(servicioActual);
        setMensaje({ texto: `Recibo guardado correctamente. ${consejo}`, tipo: 'success' });
        setFormData({ tipoServicio: servicioActual, cantidadConsumida: '', costoFactura: '', mesRegistrado: '' });
      } else {
        const datos = await respuesta.json();
        setMensaje({ texto: datos.mensaje || 'Revisa la información e inténtalo de nuevo.', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error al guardar recibo:', error);
      setMensaje({ texto: 'No se pudo conectar con el servidor.', tipo: 'error' });
    }
  };

  return (
    <div className="app-page">
      <header className="topbar">
        <Link className="brand-lockup brand-lockup--dark" to="/menu" aria-label="PagoHogar, menú principal">
          <span className="brand-mark">P</span>
          <span>PagoHogar</span>
        </Link>
        <Link className="button-quiet" to="/menu"><span aria-hidden="true">←</span> Menú principal</Link>
      </header>

      <main className="content-wrap form-page-wrap">
        <section className={`service-banner service-banner--${servicioActual.toLowerCase()}`}>
          <span className="eyebrow">NUEVO REGISTRO</span>
          <h1>Factura de {servicioActual}</h1>
          <p>Agrega los datos de tu factura para mantener actualizado el historial de tu hogar.</p>
        </section>

        <section className="surface-card consumption-form-card">
          {mensaje.texto && <div className={`form-alert form-alert--${mensaje.tipo}`} role="status">{mensaje.texto}</div>}

          <form onSubmit={handleSubmit} className="form-stack">
            <div className="field-group">
              <label htmlFor="consumo-cantidad">Consumo mensual <span>({unidadMedida})</span></label>
              <input
                id="consumo-cantidad"
                type="number"
                step="any"
                min="0"
                name="cantidadConsumida"
                value={formData.cantidadConsumida}
                onChange={handleChange}
                placeholder={unidadMedida === 'kWh' ? 'Ej. 145' : 'Ej. 12'}
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor="consumo-costo">Total de la factura <span>(COP)</span></label>
              <div className="input-prefix-wrap">
                <span>$</span>
                <input
                  id="consumo-costo"
                  type="number"
                  min="0"
                  name="costoFactura"
                  value={formData.costoFactura}
                  onChange={handleChange}
                  placeholder="Ej. 85000"
                  required
                />
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="consumo-mes">Mes facturado</label>
              <input
                id="consumo-mes"
                type="month"
                name="mesRegistrado"
                value={formData.mesRegistrado}
                onChange={handleChange}
                required
              />
            </div>
            <button className="button-primary" type="submit">Guardar recibo <span aria-hidden="true">→</span></button>
          </form>
          <p className="form-note">Los datos se usarán para actualizar la gráfica y el historial de consumo.</p>
        </section>
      </main>
      <footer className="app-footer">PAGOHOGAR <span>·</span> GESTIÓN DE CONSUMO DEL HOGAR</footer>
    </div>
  );
};

export default FormularioConsumo;
