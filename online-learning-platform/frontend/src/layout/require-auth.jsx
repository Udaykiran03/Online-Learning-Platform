import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar/Navbar";
import { Loading } from "../pages/Loading";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (auth?.user === null && !redirecting) {
      const redirectTimeout = setTimeout(() => {
        setRedirecting(true);
      }, 4000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [auth?.user, redirecting]);

  if (auth?.loading) return <Loading />;

  return allowedRoles?.includes(auth?.user?.type) ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : redirecting ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : auth?.user ? (
    <Navigate to="/unauthorised" state={{ from: location }} replace />
  ) : null;
};

export default RequireAuth;
