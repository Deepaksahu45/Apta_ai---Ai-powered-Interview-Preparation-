import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(true);

  // useEffect(() => {
  //   const getAndSetUser = async () => {
  //     const data = await getMe();
  //     setuser(data.user);
  //     setloading(false);
  //   };
  //   getAndSetUser();
  // }, []);

  return (
    <AuthContext.Provider value={{ user, setuser, loading, setloading }}>
      {children}
    </AuthContext.Provider>
    // this provider will wrap the entire app, so all components can access the auth context
  );
};
