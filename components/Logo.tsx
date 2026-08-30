export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg
      className="brand__mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="MyMedigapRate"
      fill="none"
    >
      <rect width="32" height="32" rx="8" fill="#0f4c81" />
      {/* A filing ledger: three bars, the newest one stepping up. */}
      <rect x="7" y="18" width="4" height="7" rx="1.2" fill="#8fb6d6" />
      <rect x="14" y="13" width="4" height="12" rx="1.2" fill="#bcd6ea" />
      <rect x="21" y="8" width="4" height="17" rx="1.2" fill="#ffffff" />
    </svg>
  );
}
