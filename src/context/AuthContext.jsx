import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // patient ou medecin
  const [role, setRole] = useState(null); // "patient" ou "medecin"
  const [token, setToken] = useState(localStorage.getItem("auth_token") || "");

  // Ajoutez isAuthenticated qui se base sur la présence du token
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser && storedRole && storedToken) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setToken(storedToken);
      setIsAuthenticated(true); // Mettez à jour isAuthenticated
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const loginUser = (userData, userRole, accessToken) => {
    setUser(userData);
    setRole(userRole);
    setToken(accessToken);
    setIsAuthenticated(true); // Mettez à jour isAuthenticated

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userRole);
    localStorage.setItem("auth_token", accessToken);
  };

  const logoutUser = () => {
    setUser(null);
    setRole(null);
    setToken("");
    setIsAuthenticated(false); // Mettez à jour isAuthenticated

    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated, // Ajoutez isAuthenticated ici
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
