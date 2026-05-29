import { useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import { useVaultStore } from "./lib/store";

export default function App() {
  const loadSnippets = useVaultStore((s) => s.loadSnippets);

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  return <Layout />;
}
