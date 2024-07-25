import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.tsx";


/**LoggedOutProtection: Navagites to '/landing' if user is not logged in else renders children
 *
 *Props:
 * - children (ReactNode)
 *
 *State:
 * - none
 *
 * App -> RoutesList -> LoggedOutProtection -> children
 */
function LoggedOutProtection({ children }: { children: ReactNode }): ReactNode {
    const {user } = useUser();
    if (!user) {
      return <Navigate to="/landing" replace />;
    }
    return children;
}

export default LoggedOutProtection;