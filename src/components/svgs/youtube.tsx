export default function Youtube(props) {
  return (
    <svg
      width={props.height || 32}
      height={props.height || 32}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C2A15F"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <path d="M10 9l5 3-5 3V9z" />
    </svg>
  )
}
