import React, { createContext, useState } from "react";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState({
      id: 'WpRZ4vTqzGhS44BlLnWjeUenEwe2',
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
