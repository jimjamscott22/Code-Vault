import { useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import { useVaultStore } from "./lib/store";

export default function App() {
  const loadSnippets = useVaultStore((s) => s.loadSnippets);
  const loadFolders = useVaultStore((s) => s.loadFolders);
  const loadTagCategories = useVaultStore((s) => s.loadTagCategories);

  useEffect(() => {
    loadSnippets();
    loadFolders();
    loadTagCategories();
  }, [loadSnippets, loadFolders, loadTagCategories]);

  return <Layout />;
}
