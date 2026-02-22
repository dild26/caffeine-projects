import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "./components/Router";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider>
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <App />
        </InternetIdentityProvider>
      </QueryClientProvider>
    </RouterProvider>
  </StrictMode>,
);
