import { useEffect, useState } from "react";
import pb from "../api/pbConnect";

/* ------------------ utils ------------------ */
const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/\u00A0/g, " ") // replace non-breaking spaces
    .replace(/[^\w\s]/g, "") // remove punctuation
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim();

/* ------------------ component ------------------ */
export default function PlantLabelManager() {
  const [plants, setPlants] = useState([]);
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ fetch plants once ------------------ */
  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        if (!pb.authStore.isValid) return;

        const list = await pb.collection("plant_labels").getFullList({
          sort: "plant_name",
          fields: "id,plant_name,has_labels,user,organization",
        });

        setPlants(
          list.map((p) => ({
            ...p,
            has_labels:
              p.has_labels === "labels"
                ? "labels"
                : p.has_labels === "print"
                  ? "print"
                  : "new",
          })),
        );
      } catch (err) {
        console.error("Error fetching plants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  /* ------------------ check / map input ------------------ */
  const checkPlants = async () => {
    const lines = input
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return;

    const plantMap = new Map(plants.map((p) => [normalize(p.plant_name), p]));

    const nextResults = [];

    for (const raw of lines) {
      const key = normalize(raw);
      const existing = plantMap.get(key);

      if (existing) {
        nextResults.push({
          id: existing.id,
          name: raw,
          hasLabels: existing.has_labels,
          status: "known",
        });
      } else {
        // create new plant in PocketBase
        const created = await pb.collection("plant_labels").create({
          plant_name: raw,
          has_labels: "new",
          user: pb.authStore.model.id,
        });

        const createdWithState = { ...created, has_labels: "new" };

        nextResults.push({
          id: created.id,
          name: raw,
          hasLabels: "new",
          status: "new",
        });

        setPlants((prev) => [...prev, createdWithState]);
      }
    }

    setResults(nextResults);
  };

  /* ------------------ resolve / toggle ------------------ */
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

  if (loading)
    return (
      <div className="flex justify-center items-center w-full h-full text-3xl font-semibold">
        Loading…
      </div>
    );

  return (
    <div className="grid md:grid-cols-2 md:grid-rows-1 h-full p-5 bg-gray-200 gap-2">
      {/* ------------------ input ------------------ */}
      <div className="h-full flex flex-col justify-start items-center p-5 bg-white rounded-xl">
        <h1 className="text-2xl font-semibold tracking-tight">
          Plant Label Checker
        </h1>
        <p className="pb-5">
          Input plant names in full as shown on order sheet for consistancy in
          searching
        </p>
        <textarea
          className="w-full h-2/3 p-3 border rounded mb-5 border-black font-mono"
          placeholder="Paste plant names (one per line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={checkPlants}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Check plants
          </button>

          <button
            onClick={() => {
              const cleaned =
                input
                  .match(/.+?(?:\d+L(?:\s*\d+\/\d+cm)?(?:\s*tall)?|tall|cm)/gi)
                  ?.map((p) => p.trim())
                  .join("\n") || "";
              setInput(cleaned);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Clean / Split Input
          </button>

          <button
            onClick={() => setResults([])}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Clear List
          </button>
        </div>
      </div>

      {/* ------------------ results ------------------ */}
      <div className="border divide-y rounded-xl bg-white flex flex-col  p-5">
        <h1 className="text-2xl text-center font-semibold">Results</h1>

        {results.map((r, i) => (
          <div
            key={r.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3"
          >
            <span className="font-medium">
              {r.name}{" "}
              {r.hasLabels !== "new" && (
                <span
                  style={{
                    fontWeight: "bold",
                    color: r.hasLabels === "labels" ? "green" : "red",
                  }}
                >
                  (
                  {r.hasLabels === "labels"
                    ? "Has labels ✓"
                    : "Needs printing ✗"}
                  )
                </span>
              )}
            </span>

            {r.hasLabels === "new" && (
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => resolve(i, "labels")}
                  className="px-3 py-1 border border-green-600 text-green-700 rounded"
                >
                  ✓ Has labels
                </button>
                <button
                  onClick={() => resolve(i, "print")}
                  className="px-3 py-1 border border-red-600 text-red-700 rounded"
                >
                  ✗ Needs printing
                </button>
              </div>
            )}

            {r.hasLabels !== "new" && (
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() =>
                    resolve(i, r.hasLabels === "labels" ? "print" : "labels")
                  }
                  className={`px-3 py-1 border rounded ${
                    r.hasLabels === "labels"
                      ? "border-red-600 text-red-700"
                      : "border-green-600 text-green-700"
                  }`}
                >
                  Mark as{" "}
                  {r.hasLabels === "labels" ? "Needs printing" : "Has labels"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
