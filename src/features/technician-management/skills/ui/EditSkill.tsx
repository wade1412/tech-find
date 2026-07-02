import {
  Autocomplete,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { useMemo, useState, type SyntheticEvent } from "react";
import type { SkillDraft } from "../model/skills.types";

interface EditSkillProps {
  selectedSkillDraft?: SkillDraft;
  units: Unit[];
  unitsById: Map<string, Unit>;
  brandGroups: BrandGroup[];
  brandGroupById: Map<string, BrandGroup>;
  specificIssues: SpecificIssue[];
  specificIssuesById: Map<string, SpecificIssue>;
  handleAddSkill: (newSkill: SkillDraft) => void;
}

type SelectOption = {
  label: string;
  value: string;
};

const getSelectOptionsFromEntity = (entity: { name: string; id: string }[]) =>
  entity.map((element) => ({ label: element.name, value: element.id }));

const skillKinds = [
  { value: "commercial", label: "Commercial" },
  { value: "brandGroup", label: "Brand Group" },
  { value: "specificIssue", label: "Specific Issue" },
];

function EditSkill({
  selectedSkillDraft,
  units,
  brandGroups,
  specificIssues,
  handleAddSkill,
}: EditSkillProps) {
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

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(
    skillUnitId,
  );
  const [selectedSkillKind, setSelectedSkillKind] = useState<string | null>(
    skillKind,
  );
  const [selectedBrandGroupId, setSelectedBrandGroupId] = useState<
    string | null
  >(skillBrandGroupId);
  const [selectedSpecificIssueId, setSelectedSpecificIssueId] = useState<
    string | null
  >(skillSpecificIssueId);

  const unitSelectOptions = useMemo(
    () => getSelectOptionsFromEntity(units),
    [units],
  );
  const selectedUnitOption = unitSelectOptions.find(
    (opt) => opt.value === selectedUnitId,
  );

  const brandGroupSelectOptions = useMemo(
    () => getSelectOptionsFromEntity(brandGroups),
    [brandGroups],
  );
  const selectedBrandGroupOption = brandGroupSelectOptions.find(
    (opt) => opt.value === selectedBrandGroupId,
  );

  const specificIssuesSelectOptions = useMemo(() => {
    const relevantIssues = specificIssues.filter(
      (issue) => issue.unit_id === selectedUnitId,
    );

    return getSelectOptionsFromEntity(relevantIssues);
  }, [specificIssues, selectedUnitId]);
  const selectedSpecificIssueOption = specificIssuesSelectOptions.find(
    (opt) => opt.value === selectedSpecificIssueId,
  );

  const handleUnitChange = (
    _: SyntheticEvent<Element, Event>,
    unitOption: SelectOption | null,
  ) => {
    setSelectedUnitId(unitOption?.value ?? null);
  };

  const handleSkillKindChange = (
    _: SyntheticEvent<Element, Event>,
    newKind: string,
  ) => {
    setSelectedSkillKind(newKind);
  };

  const handleBrandGroupChange = (
    _: SyntheticEvent<Element, Event>,
    brandGroupOption: SelectOption | null,
  ) => {
    setSelectedBrandGroupId(brandGroupOption?.value ?? null);
  };

  const handleSpecificIssueChange = (
    _: SyntheticEvent<Element, Event>,
    issueOption: SelectOption | null,
  ) => {
    setSelectedSpecificIssueId(issueOption?.value ?? null);
  };

  const onAddSkill = () => {
    if (!selectedUnitId) return;

    const baseFields = {
      key: selectedSkillDraft?.key || crypto.randomUUID(),
      sourceId: selectedSkillDraft?.sourceId || null,
      unitId: selectedUnitId,
    };

    let currentSkill: SkillDraft | null = null;

    if (selectedSkillKind === "brandGroup" && selectedBrandGroupId) {
      currentSkill = {
        ...baseFields,
        kind: "brandGroup",
        brandGroupId: selectedBrandGroupId,
      };
    }

    if (selectedSkillKind === "specificIssue" && selectedSpecificIssueId) {
      currentSkill = {
        ...baseFields,
        kind: "specificIssue",
        specificIssueId: selectedSpecificIssueId,
      };
    }

    if (selectedSkillKind === "commercial") {
      currentSkill = {
        ...baseFields,
        kind: "commercial",
      };
    }

    if (!currentSkill) return;

    handleAddSkill(currentSkill);
  };

  return (
    <div className="flex flex-col min-w-0 gap-2 justify-center">
      {/* Unit Select */}
      <Autocomplete
        disabled={Boolean(skillUnitId)}
        value={selectedUnitOption}
        options={unitSelectOptions}
        onChange={handleUnitChange}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => <TextField {...params} label="Unit" />}
      />

      {/* Skill Kind Toggle */}
      <div>
        <ToggleButtonGroup
          exclusive
          disabled={!selectedUnitId}
          value={selectedSkillKind}
          onChange={handleSkillKindChange}
          aria-label="Select skill kind"
        >
          {skillKinds.map((kind) => (
            <ToggleButton key={kind.label} value={kind.value}>
              {kind.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>

      {selectedSkillKind === "brandGroup" && (
        <Autocomplete
          disabled={selectedSkillKind !== "brandGroup"}
          value={selectedBrandGroupOption}
          options={brandGroupSelectOptions}
          onChange={handleBrandGroupChange}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Brand Group" />
          )}
        />
      )}

      {selectedSkillKind === "specificIssue" && (
        <Autocomplete
          disabled={selectedSkillKind !== "specificIssue"}
          value={selectedSpecificIssueOption}
          options={specificIssuesSelectOptions}
          onChange={handleSpecificIssueChange}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Specific Issue" />
          )}
        />
      )}

      <button
        type="button"
        onClick={onAddSkill}
        disabled={!selectedUnitId || !selectedSkillKind}
      >
        {skillUnitId ? "Save skill" : "Add skill"}
      </button>
    </div>
  );
}

export default EditSkill;
