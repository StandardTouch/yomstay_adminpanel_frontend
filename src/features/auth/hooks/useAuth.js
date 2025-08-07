import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function useAuth() {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUserRole = async () => {
      if (isSignedIn && user) {
        setIsCheckingRole(true);
        setError("");

        try {
          const publicMetadata = user.publicMetadata;
          const role = publicMetadata?.role;
          setUserRole(role);

          if (role === "admin") {
            // User is admin, allow access
            navigate("/dashboard");
          } else {
            // User is not admin
            setError(
              "You are not authorized to access the admin panel. Please contact your administrator."
            );
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          setError("Error verifying your access. Please try again.");
        } finally {
          setIsCheckingRole(false);
        }
      }
    };

    checkUserRole();
  }, [isSignedIn, user, navigate]);

  const signOut = async () => {
    try {
      await user?.signOut();
      setError("");
      setUserRole(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    isSignedIn,
    user,
    isLoaded,
    isCheckingRole,
    userRole,
    error,
    signOut,
    isAdmin: userRole === "admin",
  };
}
