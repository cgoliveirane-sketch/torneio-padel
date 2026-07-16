const STORAGE_KEY = "padel-tournament";

export function saveTournament(data) {
  console.log("SALVANDO", data);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

export function loadTournament() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Erro ao carregar torneio:", error);
    return null;
  }
}

export function clearTournament() {
  localStorage.removeItem(STORAGE_KEY);
}