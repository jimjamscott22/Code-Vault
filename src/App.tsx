import { useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import { useVaultStore } from "./lib/store";

export default function App() {
  const loadSnippets = useVaultStore((s) => s.loadSnippets);
  const loadFolders = useVaultStore((s) => s.loadFolders);

  useEffect(() => {
    loadSnippets();
    loadFolders();
  }, [loadSnippets, loadFolders]);

  return <Layout />;
}
