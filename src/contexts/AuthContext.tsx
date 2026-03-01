import { createContext, useReducer, useEffect, type ReactNode } from 'react';
import type { User, RegisterForm } from '@/types/auth';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '@/api/auth';
import { getToken, setToken, removeToken } from '@/utils/token';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_LOGOUT' };

export interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (form: RegisterForm) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return { user: action.payload.user, token: action.payload.token, isLoading: false };
    case 'AUTH_LOGOUT':
      return { user: null, token: null, isLoading: false };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: getToken(),
    isLoading: !!getToken(),
  });

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    getCurrentUser()
      .then((user) => dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } }))
      .catch(() => {
        removeToken();
        dispatch({ type: 'AUTH_LOGOUT' });
      });
  }, []);

  const login = async (username: string, password: string) => {
    const { access_token } = await apiLogin(username, password);
    setToken(access_token);
    const user = await getCurrentUser();
    dispatch({ type: 'AUTH_SUCCESS', payload: { user, token: access_token } });
  };

  const register = async (form: RegisterForm) => {
    await apiRegister(form);
  };

  const logout = () => {
    removeToken();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const value: AuthContextValue = {
    ...state,
    isAuthenticated: !!state.user && !!state.token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
