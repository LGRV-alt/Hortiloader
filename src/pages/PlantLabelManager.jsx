import { useEffect, useState } from "react";
import pb from "../api/pbConnect";

/* ------------------ utils ------------------ */

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/^\d+\s*(x|of)?\s*/i, "")
    .replace(/\s*(x|of)?\s*\d+$/i, "")
    .replace(/\s+/g, " ")
    .trim();

/* ------------------ page ------------------ */

export default function PlantLabelManager() {
  const [plants, setPlants] = useState([]);
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  /* initial load */
  useEffect(() => {
    pb.collection("plant_labels")
      .getFullList({
        sort: "plant_name",
        fields: "id,plant_name,has_labels",
      })
      .then(setPlants)
      .finally(() => setLoading(false));
  }, []);

  /* ------------------ check list ------------------ */

  const checkPlants = async () => {
    const lines = input
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (!lines.length) return;

    const map = new Map(plants.map((p) => [normalize(p.plant_name), p]));

    const nextResults = [];

    for (const raw of lines) {
      const key = normalize(raw);
      const existing = map.get(key);

      if (existing) {
        nextResults.push({
          id: existing.id,
          name: existing.plant_name,
          hasLabels: existing.has_labels,
          status: "known",
        });
      } else {
        // create immediately with NULL
        const created = await pb.collection("plant_labels").create({
          plant_name: key,
          has_labels: null,
          user: pb.authStore.model.id,
        });

        nextResults.push({
          id: created.id,
          name: created.plant_name,
          hasLabels: null,
          status: "new",
        });

        setPlants((prev) =>
          [...prev, created].sort((a, b) =>
            a.plant_name.localeCompare(b.plant_name),
          ),
        );
      }
    }

    setResults(nextResults);
  };

  /* ------------------ resolve ------------------ */

  const resolve = async (index, value) => {
    const item = results[index];

    // optimistic update
    setResults((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], hasLabels: value };
      return copy;
    });

    await pb.collection("plant_labels").update(item.id, { has_labels: value });

    setPlants((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, has_labels: value } : p)),
    );
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Plant Label Checker</h1>

      {/* input */}
      <div className="space-y-2">
        <textarea
          className="w-full h-40 p-3 border rounded font-mono"
          placeholder="Paste plant names (one per line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={checkPlants}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Check plants
        </button>
      </div>

      {/* results */}
      {results.length > 0 && (
        <div className="border rounded divide-y">
          {results.map((r, i) => (
            <div key={r.id} className="flex items-center justify-between p-3">
              <span className="font-medium">{r.name}</span>

              {r.hasLabels === true && (
                <span className="text-green-600">Has labels ✓</span>
              )}

              {r.hasLabels === false && (
                <span className="text-red-600">Needs printing ✗</span>
              )}

              {r.hasLabels === null && (
                <div className="flex gap-2">
                  <button
                    onClick={() => resolve(i, true)}
                    className="px-3 py-1 border border-green-600 text-green-700 rounded"
                  >
                    ✓ Has labels
                  </button>
                  <button
                    onClick={() => resolve(i, false)}
                    className="px-3 py-1 border border-red-600 text-red-700 rounded"
                  >
                    ✗ Needs printing
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
