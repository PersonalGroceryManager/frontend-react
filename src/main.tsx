import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { UserContextProvider } from "./contexts/UserContext.tsx";
import { ReceiptContextProvider } from "./contexts/ReceiptContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserContextProvider>
      <ReceiptContextProvider>
        <App />
      </ReceiptContextProvider>
    </UserContextProvider>
  </StrictMode>
);
