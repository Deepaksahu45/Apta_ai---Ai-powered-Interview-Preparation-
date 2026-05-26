import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth.context';
import { registerUser, loginUser, logoutUser, getMe } from '../services/auth.api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setuser, loading, setloading } = context;

  const handleLogin = async (email, password) => {
    setloading(true);
    try {
      const data = await loginUser({ email, password });
      setuser(data.user);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setloading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setloading(true);
    try {
      const data = await registerUser({ username, email, password });
      setuser(data.user);
      return data;
    } catch (error) {
      throw error;
    } finally {
      setloading(false);
    }
  };

  const handleLogout = async () => {
    setloading(true);
    try {
      await logoutUser();
      setuser(null);
    } catch (error) {
      console.log('Error logging out user:', error);
    } finally {
      setloading(false);
    }
  };

  const handleGetme = async () => {
    setloading(true);
    try {
      const data = await getMe();
      setuser(data.user);
    } catch (error) {
      console.log('Error fetching user:', error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();

        setuser(data.user);
      } catch (error) {
        setuser(null);
      } finally {
        setloading(false);
      }
    };

    getAndSetUser();
  }, []);

  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGetme,
    setloading,
  };
};
