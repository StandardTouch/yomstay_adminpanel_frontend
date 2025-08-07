import React, { useState, useEffect } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [roleError, setRoleError] = useState("");

  useEffect(() => {
    const checkUserRole = async () => {
      if (isSignedIn && user) {
        setIsCheckingRole(true);

        try {
          // Get user's public metadata
          const publicMetadata = user.publicMetadata;
          const userRole = publicMetadata?.role;

          if (userRole === "admin") {
            // User is admin, allow access
            navigate("/dashboard");
          } else {
            // User is not admin, show error
            setRoleError(
              "You are not authorized to access the admin panel. Please contact your administrator."
            );
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          setRoleError("Error verifying your access. Please try again.");
        } finally {
          setIsCheckingRole(false);
        }
      }
    };

    checkUserRole();
  }, [isSignedIn, user, navigate]);

  // Show loading while checking role
  if (isCheckingRole) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navyblue mx-auto mb-4"></div>
          <p className="text-navyblue text-lg">Verifying your access...</p>
        </div>
      </div>
    );
  }

  // Show role error if user is signed in but not admin
  if (roleError) {
    return (
      <div className="h-screen w-screen flex flex-col-reverse md:flex-row">
        {/* Left: Error Message */}
        <div className="flex-1 h-full flex flex-col justify-center items-center bg-white shadow-lg relative">
          <div className="w-full max-w-md p-4 sm:p-8 rounded-xl bg-white/90 border border-red-200 shadow-xl flex flex-col items-center">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-red-600 text-2xl sm:text-3xl font-bold mb-4">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">{roleError}</p>
              <button
                onClick={() => {
                  setRoleError("");
                  // Sign out the user
                  user?.signOut();
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Right: Color background with logo */}
        <div className="flex-1 h-full flex justify-center items-center bg-navyblue">
          <div className="flex flex-col items-center">
            <img
              src="/logo.png"
              alt="YomStay Logo"
              className="w-24 h-24 sm:w-32 sm:h-32"
            />
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in form if not signed in
  return (
    <div className="h-screen w-screen flex flex-col-reverse md:flex-row">
      {/* Left: SignIn */}
      <div className="flex-1 h-full flex flex-col justify-center items-center bg-white shadow-lg relative">
        <div className="w-full max-w-md p-4 sm:p-8 rounded-xl bg-white/90 border border-navyblue/10 shadow-xl flex flex-col items-center">
          <h2 className="text-navyblue text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
            Admin Login
          </h2>
          <SignIn
            withSignUp={false}
            appearance={{
              variables: {
                colorPrimary: "#1F204C", // navy blue
                colorText: "#1F204C",
                colorInputText: "#1F204C",
                colorTextSecondary: "#6B7280",
                colorDanger: "#e7515a",
                colorSuccess: "#00ab55",
                fontFamily: "Manrope, sans-serif",
              },
              elements: {
                socialButtonsBlockButton: { display: "none" },
                socialButtonsBlockButtonIcon: { display: "none" },
                alternativeMethods: { display: "none" },
                dividerRow: { display: "none" },
                footerAction: { display: "none" },
                formFieldInput:
                  "w-full border border-navyblue/20 focus:border-navyblue focus:ring-2 focus:ring-navyblue/30 rounded-md py-2 px-3 text-navyblue bg-[#F5F5F5]",
                card: "shadow-none bg-white/90 border border-navyblue/10",
                formButtonPrimary:
                  "bg-navyblue hover:bg-navyblue/90 text-white font-semibold",
                headerTitle: "text-navyblue text-2xl font-bold",
                headerSubtitle: "text-navyblue/80 text-base",
              },
            }}
          />
        </div>
      </div>

      {/* Right: Color background with logo */}
      <div className="flex-1 h-full flex justify-center items-center bg-navyblue">
        <div className="flex flex-col items-center">
          <img
            src="/logo.png"
            alt="YomStay Logo"
            className="w-24 h-24 sm:w-32 sm:h-32"
          />
        </div>
      </div>
    </div>
  );
}
