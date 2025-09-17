import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useClerk, useAuth } from "@clerk/clerk-react";

function VerifyMagicLinkWithPasswordReset() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clerk = useClerk();
  const { isSignedIn } = useAuth();

  const [step, setStep] = useState("verifying"); // 'verifying', 'password_reset', 'success', 'error'
  const [message, setMessage] = useState("Verifying your magic link...");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSettingPassword, setIsSettingPassword] = useState(false);

  useEffect(() => {
    const handleMagicLink = async () => {
      try {
        const token = searchParams.get("token");
        const redirectUrl = searchParams.get("redirect_url");

        console.log("Magic link verification started");
        console.log("Token:", token);
        console.log("Redirect URL:", redirectUrl);

        if (!token) {
          throw new Error("No verification token found in URL");
        }

        // If user is already signed in, go directly to password reset
        if (isSignedIn) {
          console.log(
            "User already signed in, proceeding to password reset..."
          );
          setStep("password_reset");
          setMessage("Please set your new password");
          return;
        }

        setMessage("Authenticating with your magic link...");

        // Create sign-in attempt with the magic link token
        const signInAttempt = await clerk.client.signIn.create({
          strategy: "ticket",
          ticket: token,
        });

        console.log("Sign-in attempt result:", signInAttempt);

        if (signInAttempt.status === "complete") {
          console.log("Magic link authentication successful!");

          // Set the session
          await clerk.setActive({
            session: signInAttempt.createdSessionId,
          });

          // Move to password reset step
          setStep("password_reset");
          setMessage(
            "Welcome! Please set your password to secure your account."
          );
        } else {
          throw new Error(
            `Authentication incomplete. Status: ${signInAttempt.status}`
          );
        }
      } catch (error) {
        console.error("Magic link verification failed:", error);
        setStep("error");
        setMessage(`Verification failed: ${error.message}`);

        // Redirect to sign-in after a delay
        setTimeout(() => {
          navigate("/sign-in?error=invalid_magic_link");
        }, 3000);
      }
    };

    if (step === "verifying") {
      handleMagicLink();
    }
  }, [searchParams, navigate, clerk, isSignedIn, step]);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(pwd)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    // Validate password
    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsSettingPassword(true);

    try {
      console.log("Setting user password...");

      // Update the user's password
      await clerk.user.updatePassword({
        newPassword: password,
      });

      console.log("Password set successfully!");

      setStep("success");
      setMessage("Password set successfully! Redirecting to your dashboard...");

      // Get redirect URL or default to onboarding
      const redirectUrl = searchParams.get("redirect_url");

      // Redirect after a short delay
      setTimeout(() => {
        if (redirectUrl) {
          window.location.href = decodeURIComponent(redirectUrl);
        } else {
          navigate("/onboarding");
        }
      }, 2000);
    } catch (error) {
      console.error("Password update failed:", error);
      setPasswordError(
        `Failed to set password: ${error.errors?.[0]?.message || error.message}`
      );
    } finally {
      setIsSettingPassword(false);
    }
  };

  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(pwd)) strength++;
    if (/(?=.*[A-Z])/.test(pwd)) strength++;
    if (/(?=.*\d)/.test(pwd)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(pwd)) strength++;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Loading/Verifying State */}
            {step === "verifying" && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <h2 className="mt-4 text-lg font-medium text-gray-900">
                  Verifying Access
                </h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
              </>
            )}

            {/* Password Reset Form */}
            {step === "password_reset" && (
              <>
                <div className="rounded-full h-12 w-12 bg-blue-100 mx-auto flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                </div>
                <h2 className="mt-4 text-lg font-medium text-gray-900">
                  Set Your Password
                </h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>

                <form
                  onSubmit={handlePasswordSubmit}
                  className="mt-6 space-y-4"
                >
                  <div className="text-left">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Enter your new password"
                    />

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                                getPasswordStrength(password)
                              )}`}
                              style={{
                                width: `${
                                  (getPasswordStrength(password) / 5) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {getStrengthText(getPasswordStrength(password))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-left">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Confirm your new password"
                    />
                  </div>

                  {passwordError && (
                    <div className="text-red-600 text-sm text-left">
                      {passwordError}
                    </div>
                  )}

                  {/* Password Requirements */}
                  <div className="text-left">
                    <p className="text-xs text-gray-500 mb-2">
                      Password must contain:
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li
                        className={password.length >= 8 ? "text-green-600" : ""}
                      >
                        ✓ At least 8 characters
                      </li>
                      <li
                        className={
                          /(?=.*[a-z])/.test(password) ? "text-green-600" : ""
                        }
                      >
                        ✓ One lowercase letter
                      </li>
                      <li
                        className={
                          /(?=.*[A-Z])/.test(password) ? "text-green-600" : ""
                        }
                      >
                        ✓ One uppercase letter
                      </li>
                      <li
                        className={
                          /(?=.*\d)/.test(password) ? "text-green-600" : ""
                        }
                      >
                        ✓ One number
                      </li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isSettingPassword || !password || !confirmPassword
                    }
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSettingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Setting Password...
                      </>
                    ) : (
                      "Set Password & Continue"
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Success State */}
            {step === "success" && (
              <>
                <div className="rounded-full h-12 w-12 bg-green-100 mx-auto flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h2 className="mt-4 text-lg font-medium text-green-900">
                  All Set!
                </h2>
                <p className="mt-2 text-sm text-green-600">{message}</p>
              </>
            )}

            {/* Error State */}
            {step === "error" && (
              <>
                <div className="rounded-full h-12 w-12 bg-red-100 mx-auto flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </div>
                <h2 className="mt-4 text-lg font-medium text-red-900">
                  Verification Failed
                </h2>
                <p className="mt-2 text-sm text-red-600">{message}</p>
                <p className="mt-4 text-xs text-gray-500">
                  You will be redirected to the sign-in page shortly...
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 max-w-md mx-auto">
          <details className="bg-gray-100 p-4 rounded text-xs">
            <summary className="cursor-pointer font-medium">Debug Info</summary>
            <div className="mt-2 space-y-1">
              <div>
                <strong>Token:</strong>{" "}
                {searchParams.get("token")?.substring(0, 20)}...
              </div>
              <div>
                <strong>Redirect:</strong> {searchParams.get("redirect_url")}
              </div>
              <div>
                <strong>Step:</strong> {step}
              </div>
              <div>
                <strong>Signed In:</strong> {isSignedIn ? "Yes" : "No"}
              </div>
              <div>
                <strong>Password Strength:</strong>{" "}
                {getPasswordStrength(password)}/5
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default VerifyMagicLinkWithPasswordReset;
