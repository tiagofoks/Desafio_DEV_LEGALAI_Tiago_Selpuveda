import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { loginUser, registerUser, buscarConexoes } from './api';
import FormularioScreen from './screens/FormularioScreen';
import ResultadosScreen from './screens/ResultadosScreen';
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import CadastroLoginScreen from './screens/CadastroLoginScreen';
import PerfilScreen from './screens/PerfilScreen';
import EditarPerfilScreen from './screens/EditarPerfilScreen';
import ProtectedRoute from './components/ProtectedRoute';

jest.mock('./api', () => ({
  loginUser: jest.fn(() => Promise.resolve({ token: 'test-token' })),
  registerUser: jest.fn(() => Promise.resolve({ id: 1, name: 'Test User', email: 'test@example.com' })),
  buscarConexoes: jest.fn(() => Promise.resolve([{ nome: 'User 1', afinidade: '85%' }, { nome: 'User 2', afinidade: '70%' }])),
  // Mock de outras funções da API conforme necessário
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(() => ({ state: { resultados: [{ nome: 'User 1', afinidade: '85%' }] } })),
}));

// Mock do componente ProtectedRoute
jest.mock('./components/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>, // Renderiza os filhos diretamente para facilitar os testes
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockNavigate.mockClear();
  });

  const renderWithRouterAndAuth = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="*" element={ui} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('renders CadastroLoginScreen on initial load', () => {
    renderWithRouterAndAuth(<App />);
    expect(screen.getByText(/Bem-vindo!/i)).toBeInTheDocument();
  });

  it('navigates to /cadastro on "Criar uma Conta" click', async () => {
    renderWithRouterAndAuth(<App />);
    userEvent.click(screen.getByRole('link', { name: /Criar uma Conta/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/cadastro');
  });

  it('navigates to /login on "Já possui uma conta? Entrar" click', async () => {
    renderWithRouterAndAuth(<App />);
    userEvent.click(screen.getByRole('link', { name: /Já possui uma conta? Entrar/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to /buscar after successful login', async () => {
    renderWithRouterAndAuth(<App />, { route: '/login' });
    userEvent.type(screen.getByLabelText(/Email:/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/Senha:/i), 'password123');
    userEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => expect(loginUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' }));
    await waitFor(() => expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', 'test-token'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/buscar'));
  });

  it('renders FormularioScreen on /buscar route (authenticated)', () => {
    localStorageMock.getItem.mockReturnValue('existing-token');
    renderWithRouterAndAuth(<App />, { route: '/buscar' });
    expect(screen.getByText(/Buscar Conexões/i)).toBeInTheDocument();
  });

  it('renders ResultadosScreen on /resultados route (authenticated)', () => {
    localStorageMock.getItem.mockReturnValue('existing-token');
    renderWithRouterAndAuth(<App />, { route: '/resultados' });
    expect(screen.getByText(/Resultados da Busca/i)).toBeInTheDocument();
    expect(screen.getByText(/User 1/i)).toBeInTheDocument();
  });

  it('navigates to /login if trying to access /buscar while not authenticated', async () => {
    renderWithRouterAndAuth(<App />, { route: '/buscar' });
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to /login after successful registration', async () => {
    renderWithRouterAndAuth(<App />, { route: '/cadastro' });
    userEvent.type(screen.getByLabelText(/Nome:/i), 'Test User');
    userEvent.type(screen.getByLabelText(/Email:/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/Senha:/i), 'password123');
    userEvent.type(screen.getByLabelText(/Confirmar Senha:/i), 'password123');
    userEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => expect(registerUser).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });

  it('renders PerfilScreen on /perfil route (authenticated)', () => {
    localStorageMock.getItem.mockReturnValue('existing-token');
    renderWithRouterAndAuth(<App />, { route: '/perfil' });
    expect(screen.getByText(/Perfil do Usuário/i)).toBeInTheDocument(); // Assumindo que sua tela de perfil tem esse texto
  });

  it('navigates to /login if trying to access /perfil while not authenticated', async () => {
    renderWithRouterAndAuth(<App />, { route: '/perfil' });
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders EditarPerfilScreen on /editar-perfil route (authenticated)', () => {
    localStorageMock.getItem.mockReturnValue('existing-token');
    renderWithRouterAndAuth(<App />, { route: '/editar-perfil' });
    expect(screen.getByText(/Editar Perfil/i)).toBeInTheDocument(); // Assumindo que sua tela de edição de perfil tem esse texto
  });

  it('navigates to /login if trying to access /editar-perfil while not authenticated', async () => {
    renderWithRouterAndAuth(<App />, { route: '/editar-perfil' });
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('calls buscarConexoes and navigates to /resultados on form submission', async () => {
    localStorageMock.getItem.mockReturnValue('existing-token');
    renderWithRouterAndAuth(<App />, { route: '/buscar' });

    userEvent.type(screen.getByLabelText(/Área de Interesse:/i), 'Technology');
    userEvent.type(screen.getByLabelText(/Localização:/i), 'Sorocaba');
    userEvent.click(screen.getByRole('button', { name: /Buscar Conexões/i }));

    await waitFor(() => expect(buscarConexoes).toHaveBeenCalledWith({
      nome: '', // O nome é opcional e começa vazio
      area_interesse: 'Technology',
      localizacao: 'Sorocaba',
    }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/resultados', { state: { resultados: [{ nome: 'User 1', afinidade: '85%' }, { nome: 'User 2', afinidade: '70%' }] } }));
  });
});