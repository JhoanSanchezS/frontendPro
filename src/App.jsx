import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Registro from './components/Registro';
import MenuPrincipal from './components/MenuPrincipal';
import FormularioConsumo from './components/FormularioConsumo';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/menu" element={<MenuPrincipal />} />
      <Route path="/registro-agua" element={<FormularioConsumo />} />
      <Route path="/registro-energia" element={<FormularioConsumo />} />
      <Route path="/registro-gas" element={<FormularioConsumo />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;