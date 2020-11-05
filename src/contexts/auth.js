import React, { createContext, useState } from "react";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState({
      id: 'epPBdIwKjOPNzRK1zgqLqS0JJQJ2',
      nome: 'Marco',
      email: 'marcoant008@gmail.com'
  });

  return (
    <AuthContext.Provider value={{ usuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
