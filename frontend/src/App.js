import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CadastroLoginScreen from './screens/CadastroLoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import LoginScreen from './screens/LoginScreen';
import FormularioScreen from './screens/FormularioScreen';
import ResultadosScreen from './screens/ResultadosScreen';
import PerfilScreen from './screens/PerfilScreen'; // Importe a tela de perfil se existir
import EditarPerfilScreen from './screens/EditarPerfilScreen'; // Importe a tela de edição de perfil se existir
import ProtectedRoute from './components/ProtectedRoute'; // Componente para rotas protegidas
import { AuthProvider } from './contexts/AuthContext'; // Importe o contexto de autenticação

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<CadastroLoginScreen />} />
          <Route path="/cadastro" element={<CadastroScreen />} />
          <Route path="/login" element={<LoginScreen />} />

          <Route
            path="/buscar"
            element={
              <ProtectedRoute>
                <FormularioScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resultados"
            element={
              <ProtectedRoute>
                <ResultadosScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <PerfilScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-perfil"
            element={
              <ProtectedRoute>
                <EditarPerfilScreen />
              </ProtectedRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;