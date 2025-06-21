export default function DanishTrolleyLoader() {
  return (
    <svg
      viewBox="0 0 200 250"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className="absolute w-[15rem] h-auto animate-trolleyFast lg:animate-trolleySlow"
    >
      {/* Frame */}
      <rect
        x="30"
        y="20"
        width="10"
        height="190"
        rx="2"
        fill="#6d6d6d"
        stroke="#2e2e2e"
        strokeWidth="2"
      />
      <rect
        x="160"
        y="20"
        width="10"
        height="190"
        rx="2"
        fill="#6d6d6d"
        stroke="#2e2e2e"
        strokeWidth="2"
      />

      {/* Shelves */}
      {[50, 90, 130, 170].map((y) => (
        <rect
          key={y}
          x="30"
          y={y}
          width="140"
          height={y === 170 ? 8 : 6}
          rx="2"
          fill="#b0b0b0"
          stroke="#2e2e2e"
          strokeWidth="2"
        />
      ))}

      {/* Base */}
      <rect
        x="30"
        y="200"
        width="140"
        height="10"
        rx="2"
        fill="#6d6d6d"
        stroke="#2e2e2e"
        strokeWidth="2"
      />

      {/* Wheels */}
      {[50, 150].map((cx) => (
        <g key={cx}>
          <circle
            cx={cx}
            cy="210"
            r="14"
            fill="#6d6d6d"
            stroke="#2e2e2e"
            strokeWidth="2"
          />
          <circle cx={cx} cy="210" r="5" fill="#444" />
        </g>
      ))}

      {/* Flowers */}
      {[
        { x: 100, y: 40, petal: "#ff6b6b" }, // red top
        { x: 60, y: 80, petal: "#ffd700" }, // yellow mid-left
        { x: 140, y: 80, petal: "#4a90e2" }, // blue mid-right
        { x: 100, y: 120, petal: "#ffd700" }, // yellow bottom center
        { x: 60, y: 160, petal: "#ff6b6b" }, // red bottom left
      ].map(({ x, y, petal }, idx) => (
        <g transform={`translate(${x}, ${y})`} key={idx}>
          <rect
            x="-10"
            y="0"
            width="20"
            height="12"
            rx="3"
            fill="#a0522d"
            stroke="#2e2e2e"
            strokeWidth="1"
          />
          <ellipse cx="-4" cy="-5" rx="4" ry="2" fill="#4caf50" />
          <ellipse cx="4" cy="-5" rx="4" ry="2" fill="#4caf50" />
          <g transform="translate(0,-14)">
            <circle r="6" fill={petal} />
            <circle r="2" fill="#2e2e2e" />
          </g>
        </g>
      ))}
    </svg>
  );
}
