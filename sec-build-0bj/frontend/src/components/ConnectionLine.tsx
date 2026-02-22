interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isActive: boolean;
  isTemporary?: boolean;
}

export default function ConnectionLine({ from, to, isActive, isTemporary }: ConnectionLineProps) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const controlPointOffset = Math.abs(dx) * 0.5;

  const path = `M ${from.x} ${from.y} C ${from.x + controlPointOffset} ${from.y}, ${to.x - controlPointOffset} ${to.y}, ${to.x} ${to.y}`;

  return (
    <>
      <path
        d={path}
        fill="none"
        stroke={isTemporary ? 'oklch(var(--muted-foreground))' : 'oklch(var(--primary))'}
        strokeWidth="2"
        strokeDasharray={isTemporary ? '5,5' : undefined}
        opacity={isTemporary ? 0.5 : 1}
        className={isActive ? 'animate-pulse' : ''}
      />
      {!isTemporary && (
        <circle
          cx={to.x}
          cy={to.y}
          r="4"
          fill="oklch(var(--primary))"
          className={isActive ? 'animate-pulse' : ''}
        />
      )}
    </>
  );
}
