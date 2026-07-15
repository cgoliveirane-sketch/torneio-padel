import { useState } from "react";

const pointOptions = [4, 5, 6, 7, 8, 9, 10];

export default function Configuracoes({
  settings,
  onSave,
}) {
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setMessage("");
  }

  function handleSave() {
    if (!form.tournamentName.trim()) {
      setMessage("Informe o nome do torneio.");
      return;
    }

    onSave({
      ...form,
      tournamentName: form.tournamentName.trim(),
      groupPoints: Number(form.groupPoints),
      quarterPoints: Number(form.quarterPoints),
      semiPoints: Number(form.semiPoints),
      finalPoints: Number(form.finalPoints),
    });

    setMessage("Configurações salvas com sucesso.");
  }

  function renderPointSelector(label, field) {
    return (
      <label className="rounded-2xl border bg-slate-50 p-4">
        <span className="block text-sm font-semibold text-slate-700">
          {label}
        </span>

        <select
          value={form[field]}
          onChange={(event) =>
            updateField(field, Number(event.target.value))
          }
          className="mt-2 w-full rounded-xl border bg-white px-3 py-3 font-semibold outline-none focus:border-slate-500"
        >
          {pointOptions.map((points) => (
            <option key={points} value={points}>
              Até {points} pontos
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Configurações
        </h1>

        <p className="mt-2 text-slate-600">
          Defina as regras utilizadas durante o torneio.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900">
          {message}
        </div>
      )}

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">
          Informações gerais
        </h2>

        <label className="mt-4 block">
          <span className="block text-sm font-semibold text-slate-700">
            Nome do torneio
          </span>

          <input
            type="text"
            value={form.tournamentName}
            onChange={(event) =>
              updateField(
                "tournamentName",
                event.target.value
              )
            }
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-500"
          />
        </label>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">
          Formato do mata-mata
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              updateField("useQuarterFinals", true)
            }
            className={
              form.useQuarterFinals
                ? "rounded-2xl border-2 border-slate-900 bg-slate-900 p-5 text-left text-white"
                : "rounded-2xl border bg-slate-50 p-5 text-left"
            }
          >
            <div className="text-lg font-bold">
              Com quartas de final
            </div>

            <div className="mt-1 text-sm opacity-80">
              Classificam quatro duplas de cada grupo.
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              updateField("useQuarterFinals", false)
            }
            className={
              !form.useQuarterFinals
                ? "rounded-2xl border-2 border-slate-900 bg-slate-900 p-5 text-left text-white"
                : "rounded-2xl border bg-slate-50 p-5 text-left"
            }
          >
            <div className="text-lg font-bold">
              Somente semifinal e final
            </div>

            <div className="mt-1 text-sm opacity-80">
              Classificam duas duplas de cada grupo.
            </div>
          </button>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">
          Limite de pontos por fase
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          O placar não poderá ultrapassar o valor
          selecionado.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {renderPointSelector(
            "Fase de grupos",
            "groupPoints"
          )}

          {form.useQuarterFinals &&
            renderPointSelector(
              "Quartas de final",
              "quarterPoints"
            )}

          {renderPointSelector(
            "Semifinais",
            "semiPoints"
          )}

          {renderPointSelector(
            "Final",
            "finalPoints"
          )}
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">
          Resumo
        </h2>

        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <strong>Grupos:</strong>{" "}
            até {form.groupPoints} pontos
          </div>

          {form.useQuarterFinals && (
            <div className="rounded-xl bg-slate-50 p-4">
              <strong>Quartas:</strong>{" "}
              até {form.quarterPoints} pontos
            </div>
          )}

          <div className="rounded-xl bg-slate-50 p-4">
            <strong>Semifinais:</strong>{" "}
            até {form.semiPoints} pontos
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <strong>Final:</strong>{" "}
            até {form.finalPoints} pontos
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white shadow hover:bg-emerald-600"
        >
          💾 Salvar configurações
        </button>
      </div>
    </div>
  );
}