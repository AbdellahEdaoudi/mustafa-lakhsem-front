export default function GoldVerifiedBadge({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9e29c" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#a97e1f" />
        </linearGradient>
      </defs>
      <path
        d="M20 0
           L24.6 4 L30.6 2.6 L32.6 8.6 L38.6 10.6 L37.1 16.6
           L41.1 21.1 L37.1 25.7 L38.6 31.7 L32.6 33.7
           L30.6 39.7 L24.6 38.3 L20 42.3 L15.4 38.3
           L9.4 39.7 L7.4 33.7 L1.4 31.7 L2.9 25.7
           L-1.1 21.1 L2.9 16.6 L1.4 10.6 L7.4 8.6
           L9.4 2.6 L15.4 4 Z"
        transform="translate(0,-1)"
        fill="url(#goldGrad)"
      />
      <path
        d="M11.5 21 L17.5 27 L28.5 14"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
