const STORAGE_KEY = "padel-tournament";

export function saveTournament(data) {
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

  return JSON.parse(saved);
}

export function clearTournament() {
  localStorage.removeItem(STORAGE_KEY);
}