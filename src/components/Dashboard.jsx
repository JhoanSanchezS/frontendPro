import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recibos, setRecibos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [filtroTabla, setFiltroTabla] = useState('Todos');
  const [servicioGrafica, setServicioGrafica] = useState('Agua');

  useEffect(() => {
    cargarRecibos();
  }, []);

  const cargarRecibos = async () => {
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
      navigate('/');
      return;
    }
    const usuarioGuardado = JSON.parse(usuarioString);

    try {
      const respuesta = await fetch('http://localhost:5000/api/consumo');
      const datos = await respuesta.json();

      if (respuesta.ok) {
        const recibosDelUsuario = datos.filter((recibo) =>
          recibo.usuario === usuarioGuardado.id ||
          (recibo.usuario && recibo.usuario._id === usuarioGuardado.id)
        );
        setRecibos(recibosDelUsuario);
      } else {
        setMensaje({ texto: 'No fue posible cargar tus recibos.', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error al cargar recibos:', error);
      setMensaje({ texto: 'No se pudo conectar con el servidor.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const eliminarRecibo = async (id) => {
    if (!window.confirm('¿Deseas eliminar este recibo?')) return;

    try {
      const respuesta = await fetch(`http://localhost:5000/api/consumo/${id}`, { method: 'DELETE' });
      if (respuesta.ok) {
        setMensaje({ texto: 'Recibo eliminado.', tipo: 'success' });
        setRecibos((actuales) => actuales.filter((recibo) => recibo._id !== id));
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
      } else {
        const datos = await respuesta.json();
        setMensaje({ texto: datos.mensaje || 'No fue posible eliminar el recibo.', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error al eliminar recibo:', error);
      setMensaje({ texto: 'No se pudo conectar con el servidor.', tipo: 'error' });
    }
  };

  const datosGraficaServicio = useMemo(() => {
    const agrupadoPorMes = {};
    recibos.forEach((recibo) => {
      if (recibo.tipoServicio === servicioGrafica) {
        const mes = recibo.mesRegistrado;
        if (!agrupadoPorMes[mes]) agrupadoPorMes[mes] = { mes, totalPagado: 0 };
        agrupadoPorMes[mes].totalPagado += Number(recibo.costoFactura) || 0;
      }
    });
    return Object.values(agrupadoPorMes).sort((a, b) => a.mes.localeCompare(b.mes));
  }, [recibos, servicioGrafica]);

  const recibosFiltrados = useMemo(
    () => recibos.filter((recibo) => filtroTabla === 'Todos' || recibo.tipoServicio === filtroTabla),
    [recibos, filtroTabla]
  );
  const totalRegistrado = recibos.reduce((total, recibo) => total + (Number(recibo.costoFactura) || 0), 0);
  const colorBarra = { Agua: '#168c85', Energía: '#bd8a24', Gas: '#c26b42' }[servicioGrafica];

  return (
    <div className="app-page">
      <header className="topbar">
        <Link className="brand-lockup brand-lockup--dark" to="/menu" aria-label="PagoHogar, menú principal">
          <span className="brand-mark">P</span>
          <span>PagoHogar</span>
        </Link>
        <Link className="button-quiet" to="/menu"><span aria-hidden="true">←</span> Menú principal</Link>
      </header>

      <main className="content-wrap dashboard-wrap">
        <section className="page-intro dashboard-intro">
          <span className="eyebrow">ANÁLISIS DE CONSUMO</span>
          <h1>Historial de servicios.</h1>
          <p>Consulta tus facturas y observa cómo evoluciona el gasto de tu hogar.</p>
        </section>

        {mensaje.texto && <div className={`form-alert form-alert--${mensaje.tipo}`}>{mensaje.texto}</div>}

        {cargando ? (
          <div className="surface-card empty-state"><span className="loading-line" /><p>Cargando tus registros…</p></div>
        ) : recibos.length === 0 ? (
          <div className="surface-card empty-state">
            <span className="empty-state__index">01 / REGISTROS</span>
            <h2>Aún no hay recibos registrados.</h2>
            <p>Cuando agregues una factura, aquí encontrarás su historial y evolución.</p>
            <Link className="button-primary button-primary--inline" to="/menu">Registrar un servicio <span aria-hidden="true">→</span></Link>
          </div>
        ) : (
          <>
            <section className="metric-row" aria-label="Resumen de registros">
              <article className="metric-card">
                <span className="metric-card__label">RECIBOS REGISTRADOS</span>
                <strong>{recibos.length}</strong>
                <span className="metric-card__caption">En todos los servicios</span>
              </article>
              <article className="metric-card metric-card--highlight">
                <span className="metric-card__label">VALOR ACUMULADO</span>
                <strong>${totalRegistrado.toLocaleString('es-CO')}</strong>
                <span className="metric-card__caption">Suma de los recibos guardados</span>
              </article>
              <article className="metric-card">
                <span className="metric-card__label">SERVICIO EN GRÁFICA</span>
                <strong className="metric-card__service">{servicioGrafica}</strong>
                <span className="metric-card__caption">Usa el selector para cambiar</span>
              </article>
            </section>

            <section className="surface-card chart-card">
              <div className="surface-card__heading">
                <div>
                  <span className="eyebrow">TENDENCIA MENSUAL</span>
                  <h2>Valor de las facturas</h2>
                </div>
                <div className="filter-control">
                  <label htmlFor="grafica-servicio">Servicio</label>
                  <select id="grafica-servicio" value={servicioGrafica} onChange={(e) => setServicioGrafica(e.target.value)}>
                    <option>Agua</option><option>Energía</option><option>Gas</option>
                  </select>
                </div>
              </div>
              <div className="chart-area">
                {datosGraficaServicio.length === 0 ? (
                  <div className="chart-empty">No hay registros de {servicioGrafica.toLowerCase()} para mostrar.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={datosGraficaServicio} margin={{ top: 16, right: 18, left: 8, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="#e9edf1" />
                      <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#788593', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#788593', fontSize: 12 }} tickFormatter={(valor) => `$${(valor / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(valor) => [`$${Number(valor).toLocaleString('es-CO')}`, `Factura de ${servicioGrafica}`]}
                        contentStyle={{ borderRadius: 10, border: '1px solid #e2e8ed', boxShadow: '0 8px 24px rgba(18, 35, 52, .08)' }}
                      />
                      <Bar dataKey="totalPagado" name={`Factura de ${servicioGrafica}`} fill={colorBarra} radius={[5, 5, 0, 0]} maxBarSize={54} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            <section className="surface-card history-card">
              <div className="surface-card__heading">
                <div>
                  <span className="eyebrow">DETALLE</span>
                  <h2>Recibos registrados</h2>
                </div>
                <div className="filter-control">
                  <label htmlFor="tabla-servicio">Filtrar</label>
                  <select id="tabla-servicio" value={filtroTabla} onChange={(e) => setFiltroTabla(e.target.value)}>
                    <option>Todos</option><option>Agua</option><option>Energía</option><option>Gas</option>
                  </select>
                </div>
              </div>
              <div className="table-scroll">
                <table className="history-table">
                  <thead><tr><th>Mes</th><th>Servicio</th><th>Consumo</th><th>Valor</th><th><span className="sr-only">Acciones</span></th></tr></thead>
                  <tbody>
                    {recibosFiltrados.map((recibo) => (
                      <tr key={recibo._id}>
                        <td className="table-month">{recibo.mesRegistrado}</td>
                        <td><span className={`service-label service-label--${recibo.tipoServicio.toLowerCase()}`}>{recibo.tipoServicio}</span></td>
                        <td>{recibo.cantidadConsumida}</td>
                        <td className="table-amount">${Number(recibo.costoFactura).toLocaleString('es-CO')}</td>
                        <td className="table-action"><button className="button-text-danger" onClick={() => eliminarRecibo(recibo._id)}>Eliminar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recibosFiltrados.length === 0 && <p className="table-empty">No hay recibos para este filtro.</p>}
              </div>
            </section>
          </>
        )}
      </main>
      <footer className="app-footer">PAGOHOGAR <span>·</span> GESTIÓN DE CONSUMO DEL HOGAR</footer>
    </div>
  );
};

export default Dashboard;
