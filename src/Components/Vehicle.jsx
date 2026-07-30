import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { Package, ShoppingCart, Trash2, TreeDeciduous } from "lucide-react";

// Total map capacity. Trolley presets fill a sub-block of this canvas,
// starting top-left; whatever's left over stays free for shapes.
const GRID_COLS = 4;
const GRID_ROWS = 6;

// New shapes default to a true square/circle sized to one grid cell's
// shorter side (in real pixels, so they look right regardless of the
// canvas's own aspect ratio); the trolley is a wider rectangle.
const TROLLEY_WIDTH_FACTOR = 1.6;
const MIN_SHAPE_SIZE = 4;
const DRAG_THRESHOLD = 4; // px of mouse movement before a click becomes a drag

const SHAPE_TYPES = {
  pallet: {
    icon: Package,
    label: "Pallet",
    circle: false,
    shapeClass: "border-2 border-solid",
  },
  tree: {
    icon: TreeDeciduous,
    label: "Loose Trees",
    circle: true,
    shapeClass: "border-2 border-solid rounded-full",
  },
  looseTrolley: {
    icon: ShoppingCart,
    label: "Loose Trolley",
    circle: false,
    // Thicker than the others so the dots (and gaps between them) actually
    // read as dotted at a glance, instead of blurring into a solid line.
    shapeClass: "border-4 border-dotted",
  },
};

export default function Vehicle({
  customerName,
  setCustomerName,
  readOnly,
  vehicleInfo,
  setVehicleInfo,
  printing,
}) {
  const grid = vehicleInfo.grid || [];
  const shapes = vehicleInfo.shapes || [];
  const vehicle = vehicleInfo.vehicleType;

  const [activeShape, setActiveShape] = useState(null);
  const canvasRef = useRef(null);
  const shapeToolbarRef = useRef(null);

  // Keep the armed shape tool selected across multiple placements; only
  // drop it on a repeat click of its own button (handled below) or a click
  // outside both the map and the shape-tool buttons themselves.
  useEffect(() => {
    if (!activeShape) return;

    function handleOutsideClick(e) {
      const insideCanvas = canvasRef.current?.contains(e.target);
      const insideToolbar = shapeToolbarRef.current?.contains(e.target);
      if (!insideCanvas && !insideToolbar) {
        setActiveShape(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [activeShape]);

  // Handle trolley count selection
  function handleTrolleyNumber(e) {
    const num = Number(e.target.value);
    const newGrid = Array(num).fill(""); // create empty trolley slots
    setVehicleInfo((prev) => ({
      ...prev,
      trolleyNumber: num,
      grid: newGrid,
    }));
  }

  // Handle lorry/trailer selection
  function handleVehicleSelection(e) {
    setVehicleInfo((prev) => ({
      ...prev,
      vehicleType: e.target.value,
      grid: [],
      trolleyNumber: 0,
      shapes: [],
    }));
  }

  // Assign customer name to a trolley slot
  function handleTrolleyName(_, index) {
    const updatedGrid = [...grid];
    updatedGrid[index] = customerName;
    setVehicleInfo((prev) => ({
      ...prev,
      grid: updatedGrid,
    }));
  }

  // Clear the entire grid — destructive and irreversible, so confirm first
  function handleClearGrid() {
    if (!window.confirm("Clear the whole map? This removes every trolley and placed item.")) {
      return;
    }
    setVehicleInfo((prev) => ({
      ...prev,
      grid: Array(prev.trolleyNumber).fill(""),
      shapes: [],
    }));
  }

  // Place a pallet/tree shape anywhere in the free space of the canvas
  function handleCanvasClick(e) {
    if (readOnly || !activeShape) return;
    // Ignore clicks on trolley slots / existing shapes — everything else
    // (including unused cells inside the trailer's 3x3 grid) counts as free space.
    if (e.target.closest("[data-shape-blocker]")) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const cellPx = Math.min(rect.width / GRID_COLS, rect.height / GRID_ROWS);
    const widthPx =
      activeShape === "looseTrolley" ? cellPx * TROLLEY_WIDTH_FACTOR : cellPx;
    const width = Math.min((widthPx / rect.width) * 100, 100);
    const height = Math.min((cellPx / rect.height) * 100, 100);
    const x = Math.min(Math.max(clickX - width / 2, 0), 100 - width);
    const y = Math.min(Math.max(clickY - height / 2, 0), 100 - height);

    const newShape = {
      id: nanoid(6),
      type: activeShape,
      x,
      y,
      width,
      height,
      label: "",
    };
    setVehicleInfo((prev) => ({
      ...prev,
      shapes: [...(prev.shapes || []), newShape],
    }));
  }

  // Assign the currently-selected customer name to a shape, same as a trolley slot
  function handleShapeName(id) {
    setVehicleInfo((prev) => ({
      ...prev,
      shapes: (prev.shapes || []).map((s) =>
        s.id === id ? { ...s, label: customerName } : s,
      ),
    }));
  }

  function handleRemoveShape(id) {
    setVehicleInfo((prev) => ({
      ...prev,
      shapes: (prev.shapes || []).filter((s) => s.id !== id),
    }));
  }

  // Drag the bottom-right handle to resize a shape in place
  function handleResizeStart(e, shape) {
    e.preventDefault();
    e.stopPropagation();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const keepCircular = SHAPE_TYPES[shape.type]?.circle;

    function onMove(moveEvent) {
      let width = Math.min(
        Math.max(
          ((moveEvent.clientX - canvasRect.left) / canvasRect.width) * 100 -
            shape.x,
          MIN_SHAPE_SIZE,
        ),
        100 - shape.x,
      );
      let height = Math.min(
        Math.max(
          ((moveEvent.clientY - canvasRect.top) / canvasRect.height) * 100 -
            shape.y,
          MIN_SHAPE_SIZE,
        ),
        100 - shape.y,
      );
      if (keepCircular) {
        // Equalize in real pixels (not percent) so it's a true circle even
        // though the canvas itself isn't square.
        const widthPx = (width / 100) * canvasRect.width;
        const heightPx = (height / 100) * canvasRect.height;
        const maxPx = Math.min(
          ((100 - shape.x) / 100) * canvasRect.width,
          ((100 - shape.y) / 100) * canvasRect.height,
        );
        const sizePx = Math.min(Math.max(widthPx, heightPx), maxPx);
        width = (sizePx / canvasRect.width) * 100;
        height = (sizePx / canvasRect.height) * 100;
      }
      setVehicleInfo((prev) => ({
        ...prev,
        shapes: (prev.shapes || []).map((s) =>
          s.id === shape.id ? { ...s, width, height } : s,
        ),
      }));
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  // Drag the body of a shape to move it; a plain click (no movement) assigns
  // the currently-selected customer name instead, same as a trolley slot.
  function handleShapeMouseDown(e, shape) {
    e.stopPropagation();
    if (readOnly) return;
    e.preventDefault();

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = shape.x;
    const origY = shape.y;
    let dragged = false;

    function onMove(moveEvent) {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (!dragged && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      dragged = true;

      const x = Math.min(
        Math.max(origX + (dx / canvasRect.width) * 100, 0),
        100 - shape.width,
      );
      const y = Math.min(
        Math.max(origY + (dy / canvasRect.height) * 100, 0),
        100 - shape.height,
      );
      setVehicleInfo((prev) => ({
        ...prev,
        shapes: (prev.shapes || []).map((s) =>
          s.id === shape.id ? { ...s, x, y } : s,
        ),
      }));
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (!dragged) handleShapeName(shape.id);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div
      className={`grid h-full ${
        printing ? "grid-rows-[1fr]" : "grid-rows-[1fr_6fr]"
      }`}
    >
      {/* --- Vehicle Setup Controls --- */}
      {!readOnly && (
        <div className="print:hidden flex flex-col gap-1 md:flex-row md:justify-between md:items-center px-1 py-0.5">
          <div className="print:hidden flex flex-wrap justify-center items-center gap-1">
            <div className="gap-1 flex">
              <button
                onClick={handleVehicleSelection}
                className={`w-auto px-2 py-1 rounded-lg text-xs md:text-sm hover:bg-orange-300 bg-orange-500 text-white border-borderDark border ${
                  vehicle === "lorry" ? "ring-2 ring-yellow-300" : ""
                }`}
                value="lorry"
              >
                Lorry
              </button>
              <button
                onClick={handleVehicleSelection}
                className={`w-auto px-2 py-1 rounded-lg text-xs md:text-sm hover:bg-orange-300 bg-orange-500 text-white border-borderDark border ${
                  vehicle === "trailer" ? "ring-2 ring-yellow-300" : ""
                }`}
                value="trailer"
              >
                Trailer
              </button>
            </div>

            <div className="pl-1 gap-1 flex">
              <button
                className="w-auto px-2 py-1 rounded-lg text-xs md:text-sm hover:bg-gray-300 bg-gray-500 text-white border-borderDark border"
                onClick={() => setCustomerName("Blank")}
              >
                Blank
              </button>
              <button
                className="w-auto px-2 py-1 rounded-lg text-xs md:text-sm hover:bg-red-300 bg-red-500 text-white border-borderDark border"
                onClick={() => {
                  setCustomerName("");
                  setActiveShape(null);
                }}
              >
                Erase
              </button>
              <button
                className="w-auto px-2 py-1 rounded-lg text-xs md:text-sm flex items-center gap-1 hover:bg-neutral-700 bg-neutral-900 text-white border-borderDark border"
                onClick={handleClearGrid}
              >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                Clear All
              </button>
            </div>

            <div ref={shapeToolbarRef} className="pl-1 gap-1 flex">
              {Object.entries(SHAPE_TYPES).map(([type, { icon: Icon, label }]) => (
                <button
                  key={type}
                  onClick={() =>
                    setActiveShape((prev) => (prev === type ? null : type))
                  }
                  title={`Place a ${label} — click empty space on the map, then drag its corner to resize`}
                  className={`w-auto px-2 py-1 rounded-lg text-xs md:text-sm flex items-center gap-1 border-borderDark border text-white hover:bg-green-300 bg-green-600 ${
                    activeShape === type ? "ring-2 ring-yellow-300" : ""
                  }`}
                >
                  <Icon className="w-3 h-3 md:w-4 md:h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* --- Trolley Count Buttons --- */}
          {vehicle === "trailer" ? (
            <ul className="print:hidden flex gap-1 justify-center items-center">
              <button
                onClick={handleTrolleyNumber}
                value={5}
                className="w-9 rounded-lg text-xs md:text-sm border-borderDark border py-0.5 hover:bg-blue-300 bg-blue-500 text-white "
              >
                {3}T
              </button>
              <button
                onClick={handleTrolleyNumber}
                value={8}
                className="w-9 rounded-lg text-xs md:text-sm border-borderDark border py-0.5 hover:bg-blue-300 bg-blue-500 text-white "
              >
                {6}T
              </button>
              <button
                onClick={handleTrolleyNumber}
                value={9}
                className="w-9 rounded-lg text-xs md:text-sm border-borderDark border py-0.5 hover:bg-blue-300 bg-blue-500 text-white "
              >
                {7}T
              </button>
            </ul>
          ) : (
            <ul className="print:hidden flex gap-1 justify-center items-center">
              {[4, 8, 12, 16, 20, 24].map((val) => (
                <button
                  key={val}
                  onClick={handleTrolleyNumber}
                  value={val}
                  className="w-9 rounded-lg text-xs md:text-sm border-borderDark border py-0.5 hover:bg-blue-300 bg-blue-500 text-white "
                >
                  {val}T
                </button>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* --- Vehicle Layout --- */}
      <div className="">
        <div
          ref={canvasRef}
          className={`relative h-full md:text-base text-xs ${
            vehicle === "trailer"
              ? ""
              : "md:border-4 border-2 border-black dark:border-darkBorder grid"
          } ${activeShape ? "cursor-crosshair" : ""}`}
          style={
            vehicle === "trailer"
              ? undefined
              : {
                  gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                  gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
                }
          }
          onClick={handleCanvasClick}
        >
          {vehicle === "trailer" ? (
            <div className="h-full flex flex-col items-center p-2">
              <div
                data-shape-blocker
                onClick={(e) => handleTrolleyName(e, 0)}
                className="border-black  dark:border-darkBorder border-4 w-2/3 h-12 flex justify-center items-center hover:bg-white hover:cursor-pointer"
              >
                {grid[0]}
              </div>
              <div
                data-shape-blocker
                onClick={(e) => handleTrolleyName(e, 1)}
                className="border-x-4 dark:border-darkBorder  border-black w-1/4 h-16 flex justify-center items-center hover:bg-white hover:cursor-pointer"
              >
                {grid[1]}
              </div>
              <div className="order-2 border-2 dark:border-darkBorder  border-black w-2/3 h-full grid grid-cols-3 grid-rows-3">
                {grid.slice(2).map((item, index, arr) => {
                  // Only border the right/bottom of each cell (skipped on the
                  // last column/row) so shared edges aren't doubled up against
                  // the wrapping div's own border.
                  const isLastCol = (index + 1) % 3 === 0;
                  const isLastRow = index >= (Math.ceil(arr.length / 3) - 1) * 3;
                  return (
                    <p
                      key={index + 2}
                      data-shape-blocker
                      onClick={(e) => handleTrolleyName(e, index + 2)}
                      className={`text-center dark:border-darkBorder border-black flex justify-center items-center hover:bg-white hover:cursor-pointer ${
                        isLastCol ? "" : "border-r-2"
                      } ${isLastRow ? "" : "border-b-2"}`}
                    >
                      {item}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : (
            grid.map((item, index) => {
              // Only border the right/bottom of each cell (skipped on the
              // last column/row) so shared edges aren't doubled up against
              // the canvas's own outer border.
              const isLastCol = (index + 1) % GRID_COLS === 0;
              // Based on the canvas's fixed GRID_ROWS capacity, not
              // grid.length — otherwise a partially-filled canvas (e.g. only
              // one row of trolleys placed) treats that row as "last" and
              // drops its bottom border, even though empty rows remain below it.
              const isLastRow = index >= (GRID_ROWS - 1) * GRID_COLS;
              return (
                <p
                  key={index}
                  data-shape-blocker
                  onClick={(e) => handleTrolleyName(e, index)}
                  className={`h-full w-full p-2 text-center border-black dark:border-darkBorder hover:bg-slate-200 dark:hover:bg-slate-400 flex justify-center items-center hover:cursor-pointer ${
                    isLastCol ? "" : "border-r-[1px] md:border-r-2"
                  } ${isLastRow ? "" : "border-b-[1px] md:border-b-2"}`}
                >
                  {item}
                </p>
              );
            })
          )}

          {shapes.map((shape) => {
            const meta = SHAPE_TYPES[shape.type];
            if (!meta) return null;
            const Icon = meta.icon;
            return (
              // Outer wrapper only positions/sizes the shape and hosts the
              // corner controls — it must NOT clip, or a circular tree's
              // rounded overflow cuts the resize handle/delete button away.
              <div
                key={shape.id}
                data-shape-blocker
                className="absolute"
                style={{
                  left: `${shape.x}%`,
                  top: `${shape.y}%`,
                  width: `${shape.width}%`,
                  // Printing hides the toolbar and gives the canvas different
                  // pixel dimensions than on screen, so a stored height% that
                  // made a true circle on screen can print as an oval. Forcing
                  // aspect-ratio 1/1 (driven only by width) keeps trees round
                  // in both contexts instead of relying on the stale height%.
                  ...(printing && meta.circle
                    ? { aspectRatio: "1 / 1", height: "auto" }
                    : { height: `${shape.height}%` }),
                }}
              >
                <div
                  onMouseDown={(e) => handleShapeMouseDown(e, shape)}
                  title={meta.label}
                  className={`w-full h-full ${meta.shapeClass} border-black dark:border-darkBorder bg-white/70 dark:bg-darkSecondary/80 flex flex-col items-center justify-center text-center overflow-hidden hover:bg-slate-200 dark:hover:bg-slate-500 hover:cursor-move`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  <span className="text-[10px] md:text-xs leading-tight break-words px-0.5">
                    {shape.label}
                  </span>
                </div>

                {!readOnly && !printing && (
                  <>
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveShape(shape.id);
                      }}
                      title="Remove"
                      className="print:hidden absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] leading-none flex items-center justify-center"
                    >
                      ×
                    </button>
                    <div
                      onMouseDown={(e) => handleResizeStart(e, shape)}
                      title="Drag to resize"
                      className="print:hidden absolute -bottom-1 -right-1 w-3 h-3 rounded-sm bg-black/60 dark:bg-white/60 cursor-nwse-resize"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
