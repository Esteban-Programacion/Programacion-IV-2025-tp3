import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [error, setError] = useState(null);

  const login = async (email, contraseña) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al iniciar sesion");
      }

      setToken(data.token);
      setUsername(email);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };
   const register = async (nombre, email, contraseña) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, contraseña }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al registrarse");
      }

      setToken(data.token);
      setUsername(email);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  };
  
  const logout = () => {
    setToken(null);
    setUsername(null);
    setError(null);
  };

  const fetchAuth = async (url, options = {}) => {
    if (!token) throw new Error("Sesion no iniciada");
    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        error,
        isAuthenticated: !!token,
        login,
        logout,
        fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthPage = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <h2>Ingresa para ver esta página</h2>;
  }

  return children;
};