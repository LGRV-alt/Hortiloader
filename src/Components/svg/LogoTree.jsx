export default function LogoTree({ height, width }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 240"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 34,40
         L 34,168
         Q 34,190 56,190
         L 176,190
         L 176,175
         L 56,175
         Q 49,175 49,168
         L 49,40
         Z"
        fill="#F2F3F5"
      />
      <rect x="67" y="51" width="17" height="108" fill="#2E6FE0" />
      <rect x="128" y="51" width="17" height="108" fill="#2E6FE0" />
      <rect x="84" y="97" width="44" height="16" fill="#2E6FE0" />
    </svg>
  );
}
