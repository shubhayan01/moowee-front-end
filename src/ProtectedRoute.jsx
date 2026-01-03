import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, adminOnly, children }) {
  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;
  return children;
}
