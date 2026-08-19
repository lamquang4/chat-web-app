import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtUtil } from "../utils/jwtUtil";

function PublicRoute({ children }: { children?: React.ReactNode }) {
  const location = useLocation();

  const isAuthenticated = jwtUtil.hasValidLocalRefreshToken();

  if (isAuthenticated) {
    const redirectTo =
      (location.state as { from?: Location })?.from?.pathname ?? "/messages";
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default PublicRoute;
