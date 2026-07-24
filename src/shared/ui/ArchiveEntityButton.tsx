import { archiveButtonStyle } from "../styles/styles";

interface ArchiveButtonProps {
  handleClick: () => void;
  entityLabel: string;
}

function ArchiveEntityButton({ handleClick, entityLabel }: ArchiveButtonProps) {
  return (
    <button
      type="button"
      className={archiveButtonStyle}
      onClick={handleClick}
      aria-haspopup="dialog"
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path d="M4 7.5h16M6 7.5v11h12v-11M9.5 11.5h5" />
        <path d="M4 4.5h16v3H4z" />
      </svg>
      {`Archive ${entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1)}`}
    </button>
  );
}

export default ArchiveEntityButton;
