import { Link } from "react-router";
import { createManagementItemButtonStyle } from "../styles/styles";

interface CreateNewEntityLinkButtonProps {
  linkTo: string;
  label: string;
}

function CreateNewEntityLinkButton({
  linkTo,
  label,
}: CreateNewEntityLinkButtonProps) {
  return (
    <Link to={linkTo} className={createManagementItemButtonStyle}>
      <svg
        fill="none"
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>

      <span className="text-center">{label}</span>
    </Link>
  );
}

export default CreateNewEntityLinkButton;
