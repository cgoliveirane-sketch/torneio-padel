import { supabase } from "../services/supabase";

const STORAGE_KEY = "padel-tournament";
const TOURNAMENT_ID = "torneio-principal";

export async function saveTournament(data) {
  console.log("SALVANDO", data);

  // Backup local
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );

  const { error } = await supabase
    .from("tournaments")
    .upsert(
      {
        id: TOURNAMENT_ID,
        name: "Torneio de Padel",
        data,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    );

  if (error) {
    console.error(
      "Erro ao salvar no Supabase:",
      error
    );

    throw error;
  }
}

export async function loadTournament() {
  const { data, error } = await supabase
    .from("tournaments")
    .select("data")
    .eq("id", TOURNAMENT_ID)
    .maybeSingle();

  if (!error && data?.data) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data.data)
    );

    return data.data;
  }

  if (error) {
    console.error(
      "Erro ao carregar do Supabase:",
      error
    );
  }

  // Fallback local
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch (parseError) {
    console.error(
      "Erro ao carregar torneio local:",
      parseError
    );

    return null;
  }
}

export async function clearTournament() {
  localStorage.removeItem(STORAGE_KEY);

  const { error } = await supabase
    .from("tournaments")
    .update({
      data: {},
      updated_at: new Date().toISOString(),
    })
    .eq("id", TOURNAMENT_ID);

  if (error) {
    console.error(
      "Erro ao limpar torneio no Supabase:",
      error
    );

    throw error;
  }
}