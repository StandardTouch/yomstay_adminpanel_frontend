import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="h-screen w-screen flex flex-col-reverse md:flex-row">
      {/* Left: SignIn */}
      <div className="flex-1 h-full flex flex-col justify-center items-center bg-white shadow-lg relative">
        <div className="w-full max-w-md p-4 sm:p-8 rounded-xl bg-white/90 border border-navyblue/10 shadow-xl flex flex-col items-center">
          <h2 className="text-navyblue text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
            Admin Loginssss
          </h2>
          <SignIn
            withSignUp={false}
            appearance={{
              variables: {
                colorPrimary: "#1F204C", // navy blue
                colorText: "#1F204C",
                // colorInputBackground: "#F5F5F5",
                colorInputText: "#1F204C",
                // colorBackground: "#ffffff",
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
            alt="logo"
            // className="w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6"
          />
        </div>
      </div>
    </div>
  );
}
