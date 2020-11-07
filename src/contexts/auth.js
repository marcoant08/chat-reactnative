import React, { createContext, useState } from "react";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState({
      id: 'epPBdIwKjOPNzRK1zgqLqS0JJQJ2',
      nome: 'Marco',
      email: 'marcoant008@gmail.com'
  });

  function alterar (u) {
    console.log(u)
    setUsuario(u)
  }

  return (
    <AuthContext.Provider value={{ usuario, alterar }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
