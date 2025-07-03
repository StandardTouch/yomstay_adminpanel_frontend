import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ProSidebarProvider } from "react-pro-sidebar";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "@/components/theme-provider";

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" enableSystem>
    <ClerkProvider publishableKey={key}>
      <App />
    </ClerkProvider>
    </ThemeProvider>
  </StrictMode>
);
