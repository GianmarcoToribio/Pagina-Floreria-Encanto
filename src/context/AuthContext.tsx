import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'customer';
  phone?: string;
  picture?: string;
  provider?: 'email' | 'google';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string; phone: string }) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
  register: async () => {},
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

// Función para decodificar JWT
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in a real app, this would validate against a backend
    let user;
    
    if (email === 'admin@floreria.com' && password === 'admin123') {
      user = {
        id: '1',
        name: 'Administrador',
        email: 'admin@floreria.com',
        role: 'admin' as const,
        provider: 'email' as const
      };
    } else if (email === 'supervisor@floreria.com' && password === 'super123') {
      user = {
        id: '2',
        name: 'Supervisor',
        email: 'supervisor@floreria.com',
        role: 'supervisor' as const,
        provider: 'email' as const
      };
    } else {
      // Check registered users in localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const registeredUser = registeredUsers.find((u: any) => u.email === email && u.password === password);
      
      if (registeredUser) {
        user = {
          id: registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email,
          role: 'customer' as const,
          phone: registeredUser.phone,
          provider: 'email' as const
        };
      } else {
        return Promise.reject('Credenciales inválidas');
      }
    }

    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect based on role
    if (user.role === 'admin') {
      navigate('/dashboard');
    } else if (user.role === 'supervisor') {
      navigate('/inventory');
    } else {
      navigate('/store');
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const decoded = parseJwt(credential);
      if (!decoded) {
        throw new Error('Invalid Google credential');
      }

      console.log('Google user data:', decoded);

      // Check if user already exists in our system
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      let existingUser = registeredUsers.find((u: any) => u.email === decoded.email);

      let user: User;

      if (existingUser) {
        // Update existing user with Google info
        user = {
          id: existingUser.id,
          name: decoded.name || decoded.given_name + ' ' + decoded.family_name,
          email: decoded.email,
          role: existingUser.role || 'customer',
          picture: decoded.picture,
          provider: 'google',
          phone: existingUser.phone
        };

        // Update the user in localStorage
        const updatedUsers = registeredUsers.map((u: any) => 
          u.email === decoded.email ? { 
            ...u, 
            name: user.name,
            picture: decoded.picture, 
            provider: 'google' 
          } : u
        );
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      } else {
        // Create new user
        user = {
          id: decoded.sub || Date.now().toString(),
          name: decoded.name || decoded.given_name + ' ' + decoded.family_name,
          email: decoded.email,
          role: 'customer',
          picture: decoded.picture,
          provider: 'google'
        };

        // Add to registered users
        registeredUsers.push({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          picture: user.picture,
          provider: user.provider
        });
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }

      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else if (user.role === 'supervisor') {
        navigate('/inventory');
      } else {
        navigate('/store');
      }
    } catch (error) {
      console.error('Google login error:', error);
      return Promise.reject('Error al iniciar sesión con Google');
    }
  };

  const register = async (userData: { name: string; email: string; password: string; phone: string }) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if email already exists
    if (registeredUsers.some((u: any) => u.email === userData.email)) {
      return Promise.reject('El correo electrónico ya está registrado');
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'customer',
      provider: 'email'
    };

    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Auto login after registration
    await login(userData.email, userData.password);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, register, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};