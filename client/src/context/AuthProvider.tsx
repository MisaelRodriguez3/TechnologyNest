import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginRequest, registerRequest, generateTotpQRResuqest, verifyTOTP } from '../services/auth.service';
import { UserProfile } from '../types/user.types';
import { userProfileRequest } from '../services/user.service';
import { RegisterFormData, LoginFormData } from '../schemas/user.schema';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isMfaRequired: boolean;
  error: string | null;
  success: string | null;
  setUser: (data:UserProfile) => void
  login: (data: LoginFormData) => Promise<void>;
  signup: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  generateMfaQR: (username: string) => Promise<string>;
  verifyMfa: (username: string, code: string) => Promise<void>;
  clearNotifications: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMfaRequired, setIsMfaRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const tokenTimestamp = localStorage.getItem('tokenTimestamp')
    if (!token || !tokenTimestamp) {
      setLoading(false);
      clearData()
      return;
    }

    const tokenAge = Date.now() - parseInt(tokenTimestamp)
    if (tokenAge > 24 * 60 * 60 * 1000) {
      clearData()
      setLoading(false);
      return;
    }
  
    try {
      const _user = localStorage.getItem('user')
      if(_user) {
        setUser(JSON.parse(_user))
      } else {
        const { data } = await userProfileRequest();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data))
      }
      
      if (user && ['/login', '/register'].includes(location.pathname)) {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
      logout();
    } finally {
      setLoading(false);
    }
  }, [navigate, location.pathname]); 

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const clearNotifications = () => {
    setError(null);
    setSuccess(null);
  };

  const login = useCallback(async (loginData: LoginFormData) => {
    const formData = new FormData();
    Object.entries(loginData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      setLoading(true);
      clearNotifications();
      
      const { data } = await loginRequest(formData);
      
      if ('mfa_active' in data) {
        setIsMfaRequired(true);
        navigate('/otp', { state: { username: loginData.username } });
        return;
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('tokenTimestamp', Date.now().toString())
      const userResponse = await userProfileRequest();
      setUser(userResponse.data);
      localStorage.setItem('user', JSON.stringify(userResponse.data))
      setSuccess('Inicio de sesión exitoso');
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (formData: RegisterFormData) => {
    try {
      setLoading(true);
      clearNotifications();
      
      await registerRequest(formData);
      setSuccess('Registro exitoso. Verifica tu email');
      navigate('/confirm-email', { state: { email: formData.email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de registro');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const generateMfaQR = useCallback(async (username: string): Promise<string> => {
    try {
      setLoading(true);
      clearNotifications();
      const response = await generateTotpQRResuqest(username);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generando QR');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyMfa = useCallback(async (username: string, code: string) => {
    try {
      setLoading(true);
      clearNotifications();
      
      const { data } = await verifyTOTP({ username, totp_code: code });
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('tokenTimestamp', Date.now().toString())
      const userResponse = await userProfileRequest();
      setUser(userResponse.data);
      setSuccess('Autenticación en dos pasos verificada');
      setIsMfaRequired(false);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código MFA inválido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const clearData = useCallback(() => {
    localStorage.clear()
    setUser(null)
  }, [])

  const logout = useCallback(() => {
    clearData()
    setSuccess('Sesión cerrada correctamente');
    navigate('/');
  }, [navigate]);

  const value = useMemo(() => ({
    user,
    loading,
    isMfaRequired,
    error,
    success,
    setUser,
    login,
    signup,
    logout,
    generateMfaQR,
    verifyMfa,
    clearNotifications
  }), [user, loading, isMfaRequired, error, success, setUser, login, signup, logout, generateMfaQR, verifyMfa]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}