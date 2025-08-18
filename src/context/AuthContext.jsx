import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // patient ou medecin
  const [role, setRole] = useState(null); // "patient" ou "medecin"
  const [token, setToken] = useState(localStorage.getItem("auth_token") || "");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("auth_token");

    if (storedUser && storedRole && storedToken) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setToken(storedToken);
    }
  }, []);

  const loginUser = (userData, userRole, accessToken) => {
    setUser(userData);
    setRole(userRole);
    setToken(accessToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userRole);
    localStorage.setItem("auth_token", accessToken);
  };

  const logoutUser = () => {
    setUser(null);
    setRole(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, role, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
