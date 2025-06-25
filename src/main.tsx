import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { QueryProvider } from "./lib/react_query/QueryProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
);
