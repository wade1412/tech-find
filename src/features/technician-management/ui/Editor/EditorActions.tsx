import { ghostButton, primaryButton } from "../../../../shared/styles/styles";

interface EditorActionsProps {
  isDisabled: boolean;
  isValid?: boolean;
  isInputEmpty: boolean;
  label: string;
  onClear: () => void;
  onSubmit: () => void;
}

function EditorActions({
  isDisabled,
  isValid,
  isInputEmpty,
  label,
  onClear,
  onSubmit,
}: EditorActionsProps) {
  const isSubmitDisabled = isValid ? !isValid || isDisabled : isDisabled;

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        disabled={isDisabled || isInputEmpty}
        className={ghostButton}
        aria-label={`Clear skill editor inputs`}
        onClick={onClear}
      >
        Clear
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className={primaryButton}
      >
        {label}
      </button>
    </div>
  );
}

export default EditorActions;
