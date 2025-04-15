import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import AccessDeniedPage from "../../Components/Admin/Access";
import { Axios } from "../../api/axios";
import { checkAuthApi } from "../../api/Api";
import { useState, useEffect } from "react";

export default function PrivateRoute({ children, type }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("authToken");

      try {
        const res = await Axios.get(checkAuthApi, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error("Auth check failed", err);
        Cookies.remove("authToken");
        Cookies.remove("userData");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null; // or <LoadingSpinner />

  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin || false;
  const role = user?.role;

  if (type === "requireAuth" && !isAuthenticated) {
    return <Navigate to="/Oops" />;
  }

  if (type === "requireNoAuth" && isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (type === "admin" && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (type === "superAdmin" && role !== "superAdmin") {
    return <AccessDeniedPage />;
  }

  if (type === "trackAdmin" && role !== "trackAdmin" && role !== "superAdmin") {
    return <AccessDeniedPage />;
  }

  if (type === "cvAdmin" && role !== "cvAdmin" && role !== "superAdmin") {
    return <AccessDeniedPage />;
  }

  if (
    type === "instructor" &&
    role !== "instructor" &&
    role !== "superInstructor" &&
    role !== "superAdmin"
  ) {
    return <AccessDeniedPage />;
  }

  return children;
}
