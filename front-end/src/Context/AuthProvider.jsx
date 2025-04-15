import { createContext, useContext, useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { Axios } from "../api/axios";
import { checkAuthApi } from "../api/Api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = Cookies.get("authToken");
    const userData = Cookies.get("userData");
    return token && userData ? { token, user: JSON.parse(userData) } : null;
  });

  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userData");
    setAuth(null);
    // optionally redirect user to login page
  };

  const checkAuth = async (isMounted) => {
    const token = Cookies.get("authToken");
    if (!token) return logout();

    try {
      const res = await Axios.get(checkAuthApi, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (isMounted) {
        setAuth({ token, user: res.data.user });
        Cookies.set("userData", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Auth check failed", err);
      if (isMounted) logout();
    }
  };

  useEffect(() => {
    let isMounted = true;

    checkAuth(isMounted);

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(() => ({ auth, setAuth, logout, checkAuth }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
