// components/ProtectRoute/ProtectRoute.tsx
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  console.log("ProtectedRoute - token:", token);

  if (!token) {
    // return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole || "")) {
    // return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
