// src/pages/PlantLabelManager.jsx

import { useState, useEffect } from "react";
// import PocketBase from 'pocketbase';
import pb from "../api/pbConnect";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

export default function PlantLabelManager() {
  const [plants, setPlants] = useState([]); // [{id, plant_name, has_labels}, ...]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlants() {
      try {
        const records = await pb.collection("plant_labels").getFullList({
          sort: "plant_name",
          fields: "id,plant_name,has_labels",
        });
        setPlants(records);
      } catch (err) {
        console.error(err);
        alert("Could not load plant data");
      } finally {
        setLoading(false);
      }
    }
    fetchPlants();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h4" gutterBottom align="center">
        Label Availability Checker
      </Typography>

      <DatabaseBuilder plants={plants} setPlants={setPlants} pb={pb} />
      <OrderChecker plants={plants} pb={pb} />
    </Box>
  );
}

function DatabaseBuilder({ plants, setPlants, pb }) {
  const [name, setName] = useState("");
  const [hasLabels, setHasLabels] = useState(false);

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      const result = await pb.collection("plant_labels").getList(1, 1, {
        filter: `plant_name = "${trimmed.replace(/"/g, '\\"')}"`,
      });

      if (result.items.length > 0) {
        await pb.collection("plant_labels").update(result.items[0].id, {
          has_labels: hasLabels,
        });
      } else {
        await pb.collection("plant_labels").create({
          plant_name: trimmed,
          has_labels: hasLabels,
          user: pb.authStore.model.id,
        });
      }

      // Refresh list
      const updated = await pb.collection("plant_labels").getFullList({
        sort: "plant_name",
        fields: "id,plant_name,has_labels",
      });
      setPlants(updated);

      setName("");
      setHasLabels(false);
      alert(
        `Saved: ${trimmed} → ${hasLabels ? "Has labels" : "Needs printing"}`,
      );
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      save();
    }
  };

  return (
    <Box sx={{ mb: 6, p: 3, border: "1px solid #eee", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add / Update Plant
      </Typography>
      <Box
        sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
      >
        <Autocomplete
          freeSolo
          options={plants.map((p) => p.plant_name)}
          value={name}
          onChange={(_, val) => setName(val || "")}
          onInputChange={(_, val) => setName(val)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Plant Name"
              sx={{ width: 400 }}
              onKeyDown={handleKeyDown}
            />
          )}
        />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={hasLabels}
            onChange={(e) => setHasLabels(e.target.checked)}
          />
          <Typography>Has physical labels</Typography>
        </Box>

        <Button variant="contained" onClick={save}>
          Save
        </Button>
      </Box>
      <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
        Type name → check box if you have labels → Enter/Tab to save
      </Typography>
    </Box>
  );
}

// function OrderChecker({ plants, pb }) {
//   const [text, setText] = useState("");
//   const [results, setResults] = useState([]);

//   const check = () => {
//     const lines = text
//       .split("\n")
//       .map((l) => l.trim())
//       .filter(Boolean);

//     if (!lines.length) {
//       alert("Paste some plant names");
//       return;
//     }

//     // Simple: treat each non-empty line as a plant name (ignore quantities for now)
//     const names = lines.map((line) => {
//       // Remove common prefixes/suffixes if needed
//       return line.replace(/^\d+\s*(?:x|-|of)?\s*/i, "").trim();
//     });

//     const map = new Map(
//       plants.map((p) => [p.plant_name.toLowerCase(), p.has_labels]),
//     );

//     const processed = names.map((name) => {
//       const key = name.toLowerCase();
//       const known = map.has(key);
//       return {
//         name,
//         hasLabels: known ? map.get(key) : null,
//       };
//     });

//     setResults(processed);
//   };

//   const toggleAndSave = async (item) => {
//     const newValue = !item.hasLabels;
//     try {
//       const result = await pb.collection("plant_labels").getList(1, 1, {
//         filter: `plant_name = "${item.name.replace(/"/g, '\\"')}"`,
//       });

//       if (result.items.length > 0) {
//         await pb.collection("plant_labels").update(result.items[0].id, {
//           has_labels: newValue,
//         });
//       } else {
//         await pb.collection("plant_labels").create({
//           plant_name: item.name,
//           has_labels: newValue,
//         });
//       }

//       // Quick local update
//       setResults((prev) =>
//         prev.map((r) =>
//           r.name === item.name ? { ...r, hasLabels: newValue } : r,
//         ),
//       );

//       // Optional: full refresh if you want suggestions updated immediately
//       // const updated = await pb...getFullList(...); setPlants(updated);
//     } catch (err) {
//       alert("Update failed");
//     }
//   };

//   return (
//     <Box sx={{ p: 3, border: "1px solid #eee", borderRadius: 2 }}>
//       <Typography variant="h6" gutterBottom>
//         Check Order Plants
//       </Typography>
//       <TextField
//         multiline
//         rows={6}
//         fullWidth
//         label="Paste plant names (one per line)"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         sx={{ mb: 2 }}
//       />
//       <Button variant="contained" onClick={check} fullWidth>
//         Check Availability
//       </Button>

//       {results.length > 0 && (
//         <List sx={{ mt: 3 }}>
//           {results.map((r, i) => (
//             <ListItem key={i} divider>
//               <ListItemText
//                 primary={r.name}
//                 secondary={
//                   r.hasLabels === null ? (
//                     <Box sx={{ color: "purple" }}>
//                       Unknown — check shelves
//                       <Button
//                         size="small"
//                         sx={{ ml: 2 }}
//                         onClick={() => toggleAndSave(r)}
//                       >
//                         I have labels ✓
//                       </Button>
//                       <Button
//                         size="small"
//                         color="error"
//                         sx={{ ml: 1 }}
//                         onClick={() => toggleAndSave({ ...r, hasLabels: true })} // force false path
//                       >
//                         No labels ✗
//                       </Button>
//                     </Box>
//                   ) : r.hasLabels ? (
//                     <span style={{ color: "green" }}>Has labels ✓</span>
//                   ) : (
//                     <span style={{ color: "red" }}>Needs printing ✗</span>
//                   )
//                 }
//               />
//             </ListItem>
//           ))}
//         </List>
//       )}
//     </Box>
//   );
// }

function OrderChecker({ plants, pb }) {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);

  const check = async () => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (!lines.length) {
      alert("Paste some plant names (one per line)");
      return;
    }

    // Clean names - remove quantity prefixes if present
    const names = lines.map((line) => {
      return line
        .replace(/^\d+\s*(?:x|-|of|pcs)?\s*/i, "")
        .replace(/\s*(?:x|-|of|pcs)?\s*\d+$/i, "")
        .trim();
    });

    const nameToLower = (name) => name.toLowerCase();
    const knownMap = new Map(plants.map((p) => [nameToLower(p.plant_name), p]));

    const processed = [];

    for (const name of names) {
      const key = nameToLower(name);
      if (knownMap.has(key)) {
        const entry = knownMap.get(key);
        processed.push({
          name,
          hasLabels: entry.has_labels,
          id: entry.id,
          isNew: false,
        });
      } else {
        // Auto-create with has_labels = false
        try {
          const created = await pb.collection("plant_labels").create({
            plant_name: name,
            has_labels: false,
            user: pb.authStore.model.id,
          });

          processed.push({
            name,
            hasLabels: false,
            id: created.id,
            isNew: true,
          });

          // Add to local plants list so it shows up in autocomplete immediately
          setPlants((prev) =>
            [...prev, created].sort((a, b) =>
              a.plant_name.localeCompare(b.plant_name),
            ),
          );
        } catch (err) {
          console.error("Auto-create failed:", err);
          processed.push({
            name,
            hasLabels: null,
            isNew: true,
            error: true,
          });
        }
      }
    }

    setResults(processed);
  };

  const setHasLabels = async (index, value) => {
    const item = results[index];
    if (!item.id) return;

    try {
      await pb.collection("plant_labels").update(item.id, {
        has_labels: value,
      });

      // Update local results
      setResults((prev) => {
        const newResults = [...prev];
        newResults[index] = { ...newResults[index], hasLabels: value };
        return newResults;
      });

      // Update global plants list
      setPlants((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, has_labels: value } : p)),
      );
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <Box sx={{ p: 3, border: "1px solid #eee", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Check Order Plants
      </Typography>

      <TextField
        multiline
        rows={6}
        fullWidth
        label="Paste plant names (one per line)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={check} fullWidth>
        Check & Auto-register Unknown Plants
      </Button>

      {results.length > 0 && (
        <List sx={{ mt: 3 }}>
          {results.map((r, i) => (
            <ListItem key={i} divider>
              <ListItemText
                primary={r.name}
                secondary={
                  r.error ? (
                    <span style={{ color: "red" }}>Error creating entry</span>
                  ) : r.hasLabels === null || r.isNew ? (
                    <Box
                      sx={{
                        color: "orange",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <span>New / Unknown — please verify:</span>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => setHasLabels(i, true)}
                      >
                        ✓ Has labels
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => setHasLabels(i, false)}
                      >
                        ✗ Needs printing
                      </Button>
                    </Box>
                  ) : r.hasLabels ? (
                    <span style={{ color: "green" }}>Has labels ✓</span>
                  ) : (
                    <span style={{ color: "red" }}>Needs printing ✗</span>
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
