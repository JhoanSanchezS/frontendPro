# PagoHogar

Aplicación web para registrar y consultar el consumo mensual de agua, energía y gas del hogar. El proyecto está dividido en dos repositorios: este frontend en React y un backend en Express conectado a MongoDB.

## Funcionalidades principales

1. **Registro de consumo:** permite guardar el consumo, el valor de la factura y el mes. El formulario adapta el servicio y la unidad de medida según la opción seleccionada.
2. **Historial y análisis:** muestra los recibos registrados, permite filtrar por servicio, eliminar registros y comparar el valor pagado por mes en una gráfica.
3. **Consejos de ahorro:** presenta recomendaciones para agua, energía y gas; se puede cambiar el servicio y solicitar otro consejo.

También incluye registro de cuenta e inicio de sesión.

## Tecnologías

- React y Vite
- React Router para la navegación
- Recharts para la gráfica del historial
- API REST desarrollada con Express y MongoDB

## Requisitos

- Node.js y npm
- El backend de PagoHogar ejecutándose en `http://localhost:5000`
- MongoDB disponible para el backend

## Instalación y ejecución

Desde la carpeta del frontend:

```bash
npm install
npm run dev
```

Abre la dirección que muestra Vite, normalmente `http://localhost:5173`.

En otra terminal, inicia el backend siguiendo las instrucciones de su README. El frontend envía las peticiones a `http://localhost:5000/api`.

## Rutas principales

| Ruta | Vista |
| --- | --- |
| `/` | Inicio de sesión |
| `/registro` | Crear cuenta |
| `/menu` | Acciones principales y consejos de ahorro |
| `/registro-agua` | Registrar consumo de agua |
| `/registro-energia` | Registrar consumo de energía |
| `/registro-gas` | Registrar consumo de gas |
| `/dashboard` | Gráfica e historial de recibos |

## Estructura del proyecto

- `src/components/`: pantallas y componentes de la aplicación.
- `src/components/MotorConcientizacion.js`: recomendaciones organizadas por servicio.
- `src/App.jsx`: definición de rutas.
- `src/App.css` y `src/index.css`: estilos de la interfaz.

## Comprobaciones disponibles

```bash
npm run lint
npm run build
```
