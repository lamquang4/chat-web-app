import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtUtil } from "../utils/jwtUtil";

function PrivateRoute({ children }: { children?: React.ReactNode }) {
  const location = useLocation();

  const isAuthenticated = jwtUtil.hasValidLocalRefreshToken();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default PrivateRoute;
