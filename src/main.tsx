import React from "react";
import ReactDOM from "react-dom/client";
// Bundled fonts (offline-first) — Monaspace Neon for code/UI, Fraunces for
// display titles. Loaded locally via Fontsource so the app needs no network.
import "@fontsource/monaspace-neon/400.css";
import "@fontsource/monaspace-neon/700.css";
import "@fontsource-variable/fraunces";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
