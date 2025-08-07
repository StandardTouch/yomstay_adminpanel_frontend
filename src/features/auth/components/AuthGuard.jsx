import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../common/components/spinner";

export default function AuthGuard({ children, requiredRole = "admin" }) {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        navigate("/login");
        return;
      }

      if (user) {
        setIsCheckingRole(true);

        try {
          const publicMetadata = user.publicMetadata;
          const userRole = publicMetadata?.role;

          if (userRole === requiredRole) {
            setHasAccess(true);
          } else {
            // User doesn't have required role, redirect to login
            navigate("/login");
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          navigate("/login");
        } finally {
          setIsCheckingRole(false);
        }
      }
    };

    checkAccess();
  }, [isSignedIn, user, isLoaded, navigate, requiredRole]);

  // Show loading while checking
  if (!isLoaded || isCheckingRole) {
    return <Spinner />;
  }

  // Show children if user has access
  if (hasAccess) {
    return <>{children}</>;
  }

  // Show loading while redirecting
  return <Spinner />;
}
