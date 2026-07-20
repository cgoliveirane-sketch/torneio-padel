import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Sorteio from "./pages/Sorteio";
import Configuracoes from "./pages/Configuracoes";
import TvMode from "./pages/TvMode";

const defaultSettings = {
  tournamentName: "Torneio Pós-Venda",
  groupPoints: 4,
  quarterPoints: 4,
  semiPoints: 4,
  finalPoints: 4,
  useQuarterFinals: true,
};

export default function App() {
  const [pagina, setPagina] = useState("sorteio");

  const [settings, setSettings] = useState(() => {
    const savedSettings = window.localStorage.getItem(
      "torneio-padel-settings-v2"
    );

    return savedSettings
      ? JSON.parse(savedSettings)
      : defaultSettings;
  });

  function updateSettings(newSettings) {
    setSettings(newSettings);

    window.localStorage.setItem(
      "torneio-padel-settings-v2",
      JSON.stringify(newSettings)
    );
  }

  function renderPagina() {
    switch (pagina) {
      case "sorteio":
        return <Sorteio settings={settings} />;

      case "config":
        return (
          <Configuracoes
            settings={settings}
            onSave={updateSettings}
          />
        );

      case "tv":
  return (
    <TvMode
      settings={settings}
      onExit={() => setPagina("sorteio")}
    />
  );

      default:
        return <Dashboard settings={settings} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {pagina !== "tv" && (
  <header className="bg-slate-900 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              🏆 {settings.tournamentName}
            </h1>

            <p className="text-sm text-slate-300">
              Sistema de gerenciamento do torneio
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPagina("dashboard")}
              className="rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => setPagina("sorteio")}
              className="rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600"
            >
              Sorteio
            </button>

            <button
              type="button"
              onClick={() => setPagina("config")}
              className="rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600"
            >
              Configuração
            </button>

            <button
              type="button"
              onClick={() => setPagina("tv")}
              className="rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600"
            >
              TV
            </button>
          </nav>
        </div>
      </header>
      )}
      <main
        className={
          pagina === "tv"
            ? "w-full bg-slate-950"
            : "mx-auto w-full max-w-7xl p-6"
        }
      >
        {renderPagina()}
      </main>
    </div>
  );
}