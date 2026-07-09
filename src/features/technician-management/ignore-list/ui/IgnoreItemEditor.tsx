import type { Brand } from "../../../../entities/brand/brand.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import type { IgnoreItemDraft } from "../model/ignoreList.types";

interface IgnoreItemEditorProps {
  isDisabled: boolean;
  selectedIgnoreItem?: IgnoreItemDraft;
  units: Unit[];
  unitsById: Map<string, Unit>;
  brands: Brand[];
  specificIssues: SpecificIssue[];
  handleSubmitIgnoreItem: (newSkill: IgnoreItemDraft) => void;
  editorError: string | null;
  resetEditorError: () => void;
}

function IgnoreItemEditor({
  isDisabled,
  selectedIgnoreItem,
  units,
  unitsById,
  brands,
  specificIssues,
  handleSubmitIgnoreItem,
  editorError,
  resetEditorError,
}) {
  return <div>IgnoreItemEditor</div>;
}

export default IgnoreItemEditor;
