import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ApiProvider } from "./contexts/ApiContext";
import ApiErrorBoundary from "./contexts/ApiErrorBoundary";
import "react-toastify/dist/ReactToastify.css";

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" enableSystem>
        <ClerkProvider publishableKey={key}>
          <ApiErrorBoundary>
            <ApiProvider>
              <App />
            </ApiProvider>
          </ApiErrorBoundary>
        </ClerkProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
