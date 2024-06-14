const AlertSvg = ({ className }: { className: string }) => (
  <svg
    id="alert"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 32 32"
    enableBackground="new 0 0 32 32"
    xmlSpace="preserve"
    className={className}
  >
    <rect x={15} y={14} width={2} height={8} />
    <rect x={15} y={10} width={2} height={2} />
    <circle
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeMiterlimit={10}
      cx={16}
      cy={16}
      r={12}
    />
  </svg>
);
export default AlertSvg;
