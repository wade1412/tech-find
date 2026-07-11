import { Autocomplete, TextField } from "@mui/material";
import type { Brand } from "../../../../entities/brand/brand.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import type { IgnoreItemDraft } from "../model/ignoreList.types";
import { useMemo, useState, type SyntheticEvent } from "react";
import { getSelectOptionsFromEntity } from "../../ui/Editor/editor.helpers";
import type { SelectOption } from "../../ui/Editor/editor.types";
import { selectStyle } from "../../../../shared/styles/muiSelectStyles";
import { useSpecificIssueOptions } from "../../ui/Editor/useSpecificIssueOptions";
import EditorPanel from "../../ui/Editor/EditorPanel";
import EditorActions from "../../ui/Editor/EditorActions";
import EditorError from "../../ui/Editor/EditorError";

interface IgnoreItemEditorProps {
  technicianId: string;
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
  technicianId,
  isDisabled,
  selectedIgnoreItem,
  units,
  brands,
  specificIssues,
  handleSubmitIgnoreItem,
  editorError,
  resetEditorError,
}: IgnoreItemEditorProps) {
  // Get Fiedlds from exisiting Ignore rule or null
  const ignoreUnitId = selectedIgnoreItem?.unit_id || null;
  const ignoreBrandId = selectedIgnoreItem?.brand_id || null;
  const ignoreSpecificIssueId = selectedIgnoreItem?.specific_issue_id || null;
  const ignoreSpecificIssue = specificIssues.find(
    (issue) => issue.id === ignoreSpecificIssueId,
  );

  // Field States
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(
    ignoreUnitId ?? ignoreSpecificIssue?.unit_id ?? null,
  );
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(
    ignoreBrandId,
  );
  const [selectedSpecificIssueId, setSelectedSpecificIssueId] = useState<
    string | null
  >(ignoreSpecificIssueId);

  // Unit options and selected
  const unitSelectOptions = useMemo(
    () => getSelectOptionsFromEntity(units),
    [units],
  );
  const selectedUnitOption =
    unitSelectOptions.find((opt) => opt.value === selectedUnitId) ?? null;

  //Brand options and selected
  const brandSelectOptions = useMemo(
    () => getSelectOptionsFromEntity(brands),
    [brands],
  );
  const selectedBrandOption =
    brandSelectOptions.find((brand) => brand.value === selectedBrandId) ?? null;

  // Specific Issues Map By unit, options and selected
  const { specificIssuesSelectOptions } = useSpecificIssueOptions(
    selectedUnitId,
    specificIssues,
  );

  const selectedSpecificIssueOption =
    specificIssuesSelectOptions.find(
      (opt) => opt.value === selectedSpecificIssueId,
    ) ?? null;
  const selectedSpecificIssue = specificIssues.find(
    (issue) => issue.id === selectedSpecificIssueId,
  );

  //Handlers
  const handleUnitChange = (
    _: SyntheticEvent<Element, Event>,
    unitOption: SelectOption | null,
  ) => {
    const nextUnitId = unitOption?.value ?? null;

    resetEditorError();
    setSelectedUnitId(nextUnitId);
    setSelectedSpecificIssueId(null);
  };

  const handleBrandChange = (
    _: SyntheticEvent<Element, Event>,
    brandOption: SelectOption | null,
  ) => {
    const nextBrandId = brandOption?.value ?? null;

    resetEditorError();
    setSelectedBrandId(nextBrandId);
  };

  const handleSpecificIssueChange = (
    _: SyntheticEvent<Element, Event>,
    issueOption: SelectOption | null,
  ) => {
    const nextIssueId = issueOption?.value ?? null;

    resetEditorError();
    setSelectedSpecificIssueId(nextIssueId);
  };

  const onClear = () => {
    resetEditorError();
    setSelectedUnitId(null);
    setSelectedBrandId(null);
    setSelectedSpecificIssueId(null);
  };

  const onSubmit = () => {
    if (!isValid) return;

    if (selectedSpecificIssueId && !selectedSpecificIssue) {
      return;
    }

    const newIgnoreItemDraft: IgnoreItemDraft = {
      key: selectedIgnoreItem?.key ?? crypto.randomUUID(),
      technician_id: technicianId,
      sourceId: null,
      unit_id: selectedSpecificIssue?.unit_id ?? selectedUnitId,
      brand_id: selectedBrandId,
      specific_issue_id: selectedSpecificIssueId,
    };

    handleSubmitIgnoreItem(newIgnoreItemDraft);
  };

  const isInputEmpty =
    !selectedUnitId && !selectedBrandId && !selectedSpecificIssueId;
  const isValid =
    selectedUnitId !== null ||
    selectedBrandId !== null ||
    selectedSpecificIssueId !== null;

  return (
    <EditorPanel
      title={selectedIgnoreItem ? "Edit Ignore Item" : "New Ignore Item"}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Unit Select */}
        <Autocomplete
          disabled={isDisabled}
          value={selectedUnitOption}
          options={unitSelectOptions}
          onChange={handleUnitChange}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          getOptionLabel={(option) => option.label}
          sx={(theme) => ({ ...selectStyle(theme) })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Unit"
              helperText="Empty means all units"
            />
          )}
        />

        {/* Brand Select */}
        <Autocomplete
          disabled={isDisabled}
          value={selectedBrandOption}
          options={brandSelectOptions}
          onChange={handleBrandChange}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          getOptionLabel={(option) => option.label}
          sx={(theme) => selectStyle(theme)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Brand"
              helperText="Empty means all brands"
            />
          )}
        />
      </div>

      {/* Issue Select */}
      {specificIssuesSelectOptions.length > 0 && (
        <Autocomplete
          disabled={isDisabled}
          value={selectedSpecificIssueOption}
          options={specificIssuesSelectOptions}
          onChange={handleSpecificIssueChange}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          getOptionLabel={(option) => option.label}
          sx={(theme) => selectStyle(theme)}
          renderInput={(params) => (
            <TextField {...params} label="Specific Issue" />
          )}
        />
      )}

      {editorError && <EditorError error={editorError} />}

      <EditorActions
        isDisabled={isDisabled}
        isInputEmpty={isInputEmpty}
        isValid={isValid}
        label={selectedIgnoreItem ? "Save Ignore Item" : "Add Ignore Item"}
        onClear={onClear}
        onSubmit={onSubmit}
      />
    </EditorPanel>
  );
}

export default IgnoreItemEditor;
