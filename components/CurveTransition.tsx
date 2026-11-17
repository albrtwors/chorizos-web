import styles from "./CurveTransition.module.css";

type CurveTransitionProps = {
  from: string;
  to: string;
  variant?: "crest" | "dip";
  className?: string;
};

const paths = {
  crest:
    "M0,160 L0,104 C210,48 420,148 660,116 C900,84 1160,24 1440,84 L1440,160 Z",
  dip: "M0,160 L0,74 C190,128 420,42 680,78 C940,114 1200,150 1440,58 L1440,160 Z",
};

export default function CurveTransition({
  from,
  to,
  variant = "crest",
  className,
}: CurveTransitionProps) {
  return (
    <div
      className={`${styles.wrap} ${className ?? ""}`}
      style={{ backgroundColor: from }}
      aria-hidden="true"
    >
      <svg
        className={styles.svg}
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        role="presentation"
      >
        <path
          className={styles.ghost}
          d={paths[variant]}
          fill={to}
          transform="translate(0 -18)"
        />
        <path d={paths[variant]} fill={to} />
      </svg>
    </div>
  );
}
