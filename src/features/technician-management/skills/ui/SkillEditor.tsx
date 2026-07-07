import { Autocomplete, TextField } from "@mui/material";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { useMemo, useState, type SyntheticEvent } from "react";
import type { SkillDraft } from "../model/skills.types";
import { selectStyle } from "../../../../shared/styles/muiSelectStyles";
import {
  ghostButton,
  headingStyleDefault,
  primaryButton,
} from "../../../../shared/styles/styles";

interface EditSkillProps {
  isDisabled: boolean;
  selectedSkillDraft?: SkillDraft;
  units: Unit[];
  unitsById: Map<string, Unit>;
  brandGroups: BrandGroup[];
  specificIssues: SpecificIssue[];
  handleSubmitSkill: (newSkill: SkillDraft) => void;
  duplicateError: string | null;
  resetDuplicateError: () => void;
}

type SelectOption = {
  label: string;
  value: string;
};

const getSelectOptionsFromEntity = (entity: { name: string; id: string }[]) =>
  entity.map((element) => ({ label: element.name, value: element.id }));

type SkillKind = SkillDraft["kind"];

const skillKindOptions: { value: SkillKind; label: string }[] = [
  { value: "commercial", label: "Commercial" },
  { value: "brandGroup", label: "Brand Group" },
  { value: "specificIssue", label: "Specific Issue" },
];
function SkillEditor({
  isDisabled,
  selectedSkillDraft,
  units,
  unitsById,
  brandGroups,
  specificIssues,
  handleSubmitSkill,
  duplicateError,
  resetDuplicateError,
}: EditSkillProps) {
  // Fields from existing skill or null
  const skillUnitId = selectedSkillDraft?.unitId || null;
  const skillKind = selectedSkillDraft?.kind || null;
  const skillBrandGroupId =
    selectedSkillDraft?.kind === "brandGroup"
      ? selectedSkillDraft.brandGroupId
      : null;
  const skillSpecificIssueId =
    selectedSkillDraft?.kind === "specificIssue"
      ? selectedSkillDraft.specificIssueId
      : null;

  // States
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(
    skillUnitId,
  );
  const [selectedSkillKind, setSelectedSkillKind] = useState<SkillKind | null>(
    skillKind,
  );
  const [selectedBrandGroupId, setSelectedBrandGroupId] = useState<
    string | null
  >(skillBrandGroupId);
  const [selectedSpecificIssueId, setSelectedSpecificIssueId] = useState<
    string | null
  >(skillSpecificIssueId);

  // Unit options and selected
  const unitSelectOptions = useMemo(
    () => getSelectOptionsFromEntity(units),
    [units],
  );
  const selectedUnitOption =
    unitSelectOptions.find((opt) => opt.value === selectedUnitId) ?? null;

  // BrandGroup options and selected
  const brandGroupSelectOptions = useMemo(
    () => getSelectOptionsFromEntity(brandGroups),
    [brandGroups],
  );
  const selectedBrandGroupOption =
    brandGroupSelectOptions.find((opt) => opt.value === selectedBrandGroupId) ??
    null;

  // Specific Issues Map By unit, options and selected
  const specificIssueUnitIds = useMemo(
    () => new Set(specificIssues.map((issue) => issue.unit_id)),
    [specificIssues],
  );
  const specificIssuesSelectOptions = useMemo(() => {
    if (!selectedUnitId) return [];

    const relevantIssues = specificIssues.filter(
      (issue) => issue.unit_id === selectedUnitId,
    );

    return getSelectOptionsFromEntity(relevantIssues);
  }, [specificIssues, selectedUnitId]);

  const selectedSpecificIssueOption =
    specificIssuesSelectOptions.find(
      (opt) => opt.value === selectedSpecificIssueId,
    ) ?? null;

  // Generate allowed kinds based on the unit (some units cannot be commercial or dont have specific issues)
  const allowedSkillKindOptions = selectedUnitId
    ? skillKindOptions.filter((option) => {
        const selectedUnit = unitsById.get(selectedUnitId || "");

        if (!selectedUnit?.can_be_commercial && option.value === "commercial")
          return false;

        if (
          !specificIssueUnitIds.has(selectedUnitId) &&
          option.value === "specificIssue"
        )
          return false;

        return true;
      })
    : skillKindOptions;

  // Handlers
  const handleUnitChange = (
    _: SyntheticEvent<Element, Event>,
    unitOption: SelectOption | null,
  ) => {
    const nextUnitId = unitOption?.value ?? null;

    resetDuplicateError();
    setSelectedUnitId(nextUnitId);
    setSelectedSkillKind(null);
    setSelectedBrandGroupId(null);
    setSelectedSpecificIssueId(null);
  };

  const handleSkillKindSelect = (newKind: SkillKind) => {
    resetDuplicateError();
    setSelectedSkillKind((prev) => (prev === newKind ? null : newKind));
    setSelectedBrandGroupId(null);
    setSelectedSpecificIssueId(null);
  };

  const handleBrandGroupChange = (
    _: SyntheticEvent<Element, Event>,
    brandGroupOption: SelectOption | null,
  ) => {
    resetDuplicateError();
    setSelectedBrandGroupId(brandGroupOption?.value ?? null);
  };

  const handleSpecificIssueChange = (
    _: SyntheticEvent<Element, Event>,
    issueOption: SelectOption | null,
  ) => {
    resetDuplicateError();
    setSelectedSpecificIssueId(issueOption?.value ?? null);
  };

  const onClear = () => {
    resetDuplicateError();
    setSelectedUnitId(skillUnitId ? skillUnitId : null);
    setSelectedSkillKind(null);
    setSelectedBrandGroupId(null);
    setSelectedSpecificIssueId(null);
  };

  const onSubmit = () => {
    if (!selectedUnitId) return;

    const baseFields = {
      key: selectedSkillDraft?.key ?? crypto.randomUUID(),
      sourceId: null,
      unitId: selectedUnitId,
    };

    let currentSkill: SkillDraft;

    switch (selectedSkillKind) {
      case "brandGroup":
        if (!selectedBrandGroupId) return;

        currentSkill = {
          ...baseFields,
          kind: "brandGroup",
          brandGroupId: selectedBrandGroupId,
        };
        break;

      case "specificIssue":
        if (!selectedSpecificIssueId) return;

        currentSkill = {
          ...baseFields,
          kind: "specificIssue",
          specificIssueId: selectedSpecificIssueId,
        };
        break;

      case "commercial":
        currentSkill = {
          ...baseFields,
          kind: "commercial",
        };
        break;

      default:
        return;
    }

    handleSubmitSkill(currentSkill);
  };

  const isInputEmpty =
    (Boolean(skillUnitId) || !selectedUnitId) &&
    !selectedSkillKind &&
    !selectedBrandGroupId &&
    !selectedSpecificIssueId;

  const isValid =
    selectedUnitId !== null &&
    (selectedSkillKind === "commercial" ||
      (selectedSkillKind === "brandGroup" && selectedBrandGroupId !== null) ||
      (selectedSkillKind === "specificIssue" &&
        selectedSpecificIssueId !== null));

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 px-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h3 className={headingStyleDefault}>
            {selectedSkillDraft ? "Edit Skill" : "New Skill"}
          </h3>{" "}
        </div>

        {/* Unit Select */}
        <Autocomplete
          disabled={Boolean(skillUnitId) || isDisabled}
          value={selectedUnitOption}
          options={unitSelectOptions}
          onChange={handleUnitChange}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          getOptionLabel={(option) => option.label}
          sx={(theme) => ({ ...selectStyle(theme) })}
          renderInput={(params) => <TextField {...params} label="Unit" />}
        />

        {/* Skill Kind Toggle */}
        <div
          role="group"
          aria-label="Select skill kind"
          className="flex overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60"
        >
          {allowedSkillKindOptions.map((kind, index) => (
            <button
              key={kind.value}
              type="button"
              disabled={!selectedUnitId || isDisabled}
              onClick={() => handleSkillKindSelect(kind.value)}
              className={[
                "flex-1 px-2 py-2.5 text-xs font-semibold transition-colors cursor-pointer focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-main-500 disabled:cursor-not-allowed disabled:opacity-50",
                index > 0 && "border-l border-zinc-200 dark:border-zinc-800",
                selectedSkillKind === kind.value
                  ? "bg-main-500 dark:bg-main-400 text-zinc-950"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {kind.label}
            </button>
          ))}
        </div>

        {selectedSkillKind === "brandGroup" && (
          <Autocomplete
            disabled={isDisabled}
            value={selectedBrandGroupOption}
            options={brandGroupSelectOptions}
            onChange={handleBrandGroupChange}
            isOptionEqualToValue={(option, value) =>
              option?.value === value?.value
            }
            getOptionLabel={(option) => option.label}
            sx={(theme) => selectStyle(theme)}
            renderInput={(params) => (
              <TextField {...params} label="Brand Group" />
            )}
          />
        )}

        {selectedSkillKind === "specificIssue" && (
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

        {duplicateError && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
          >
            {duplicateError}
          </p>
        )}

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
            disabled={!isValid || isDisabled}
            className={primaryButton}
          >
            {selectedSkillDraft ? "Save Skill" : "Add Skill"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SkillEditor;
