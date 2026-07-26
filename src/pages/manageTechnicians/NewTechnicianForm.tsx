import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { IgnoreItemDraft } from "../../features/technician-management/ignore-list/model/ignoreList.types";
import type {
  CapabilityFieldKey,
  JobsPerDayDraft,
  ProfileFieldKey,
} from "../../features/technician-management/profile-and-capabilities/model/profile.types";
import type { SkillDraft } from "../../features/technician-management/skills/model/skills.types";
import PageHeader from "../../shared/ui/PageHeader";
import { formStyle, primaryButton } from "../../shared/styles/styles";
import { validateProfileForm } from "../../features/technician-management/profile-and-capabilities/model/profile.validation";
import {
  editTechnicianSections,
  type EditTechnicianSectionId,
} from "../../features/technician-management/model/manageTechnicians.constants";
import EditSectionCard from "../../shared/ui/EditSectionCard";
import ActiveStatusBar from "../../shared/ui/ActiveStatusBar";
import ProfileAndCapabilitiesFields from "../../features/technician-management/profile-and-capabilities/ui/ProfileAndCapabilitiesFields";
import {
  formatJobsPerDayRange,
  parseJobsPerDayRange,
} from "../../features/technician-management/profile-and-capabilities/model/profile.helpers";
import ServiceZoneFields from "../../features/technician-management/service-zones/ui/ServiceZoneFields";
import type { Unit } from "../../entities/unit/unit.types";
import type { Brand } from "../../entities/brand/brand.types";
import type { BrandGroup } from "../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../entities/specific-issue/specific-issue.types";
import type { ServiceZone } from "../../entities/service-zone/service-zone.types";
import SkillFields from "../../features/technician-management/skills/ui/SkillFields";
import IgnoreListFields from "../../features/technician-management/ignore-list/ui/IgnoreListFields";
import {
  buildCreateTechnicianInput,
  createEmptyNewTechnicianDraft,
} from "../../features/technician-management/new-technician/model/newTechnician.helpers";
import type { NewTechnicianDraft } from "../../features/technician-management/new-technician/model/newTechnician.types";
import { useCreateTechnicianMutation } from "../../features/technician-management/new-technician/model/useCreateTechnicianMutation";
import { SKILL_TEMPLATES } from "../../features/technician-management/skills/model/skillTemplates.constants";

interface NewTechnicianFormProps {
  units: Unit[];
  unitsById: Map<string, Unit>;
  brands: Brand[];
  brandsById: Map<string, Brand>;
  brandGroups: BrandGroup[];
  brandGroupById: Map<string, BrandGroup>;
  specificIssues: SpecificIssue[];
  specificIssuesById: Map<string, SpecificIssue>;
  zones: ServiceZone[];
}

function NewTechnicianForm({
  units,
  unitsById,
  brands,
  brandsById,
  brandGroups,
  brandGroupById,
  specificIssues,
  specificIssuesById,
  zones,
}: NewTechnicianFormProps) {
  const [newTechnicianDraft, setNewTechnicianDraft] =
    useState<NewTechnicianDraft>(() => createEmptyNewTechnicianDraft());
  const [selectedSectionId, setSelectedSectionId] =
    useState<EditTechnicianSectionId>("profile");
  const navigate = useNavigate();
  const createTechnicianMutation = useCreateTechnicianMutation();

  // ----- Profile Section Handlers -----
  const setActive = (active: boolean) =>
    setNewTechnicianDraft((prev) => ({
      ...prev,
      profile: { ...prev.profile, active },
    }));
  const onProfileFieldChange = (key: ProfileFieldKey, newValue: string) => {
    setNewTechnicianDraft((prev) => ({
      ...prev,
      profile: { ...prev.profile, [key]: newValue },
    }));
  };
  const toggleCapability = (key: CapabilityFieldKey) =>
    setNewTechnicianDraft((prev) => ({
      ...prev,
      profile: { ...prev.profile, [key]: !prev.profile[key] },
    }));
  const jobsPerDayRange = useMemo<JobsPerDayDraft>(() => {
    const [min, max] = parseJobsPerDayRange(
      newTechnicianDraft.profile.jobs_per_day,
    );
    return { min: min, max: max ?? min };
  }, [newTechnicianDraft.profile.jobs_per_day]);
  const onJobsPerDayRangeChange = (next: JobsPerDayDraft) =>
    onProfileFieldChange("jobs_per_day", formatJobsPerDayRange(next));

  // ----- Zone Section Handler -----
  const onZoneIdsChange = (newZoneIds: string[]) =>
    setNewTechnicianDraft((prev) => ({
      ...prev,
      zoneIds: newZoneIds,
    }));

  // ----- Skills Section Handler -----
  const onSkillsChange = (skills: SkillDraft[]) =>
    setNewTechnicianDraft((prev) => ({
      ...prev,
      skills,
    }));

  // ----- Ignore List Section Handler -----
  const onIgnoreListChange = (ignoreList: IgnoreItemDraft[]) =>
    setNewTechnicianDraft((prev) => ({
      ...prev,
      ignoreList,
    }));

  const isPending = createTechnicianMutation.isPending;

  //Profile is valid, if error object from validate helper has no values
  const isValidProfile = !Object.values(
    validateProfileForm(newTechnicianDraft.profile),
  ).some(Boolean);
  const canCreateNewTechnician =
    isValidProfile &&
    newTechnicianDraft.zoneIds.length > 0 &&
    newTechnicianDraft.skills.length > 0;

  const handleCreateTechnician = () => {
    if (!canCreateNewTechnician || isPending) return;

    createTechnicianMutation.mutate(
      buildCreateTechnicianInput(newTechnicianDraft),
      {
        onSuccess: (technician) => {
          navigate(`/technicians/${technician.id}/edit`, { replace: true });
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <section className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="New Technician"
            subtitle="Fill out the sections to create the new technician"
          />

          <button
            type="button"
            disabled={!canCreateNewTechnician || isPending}
            className={primaryButton}
            onClick={handleCreateTechnician}
          >
            {isPending ? "Creating..." : "Create Technician"}
          </button>
        </div>

        {createTechnicianMutation.error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
          >
            Failed to create technician. Check that the name is unique and try
            again.
          </p>
        )}

        {/* Sections Cards */}
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {editTechnicianSections.map((section) => (
            <EditSectionCard
              key={section.id}
              id={section.id}
              title={section.title}
              selectedSectionId={selectedSectionId}
              onClick={() => setSelectedSectionId(section.id)}
            />
          ))}
        </div>

        {/* Selected Section */}
        {selectedSectionId === "profile" && (
          <div className={formStyle}>
            <ActiveStatusBar
              label="Technician status"
              isActive={newTechnicianDraft.profile.active}
              disabled={isPending}
              onChange={setActive}
              activeDescription="This technician can be scheduled for jobs."
              inactiveDescription="This technician is excluded from scheduling."
            />
            <div className="p-2">
              <ProfileAndCapabilitiesFields
                disabled={isPending}
                formState={newTechnicianDraft.profile}
                onProfileFieldChange={onProfileFieldChange}
                onCapabilityToggle={toggleCapability}
                jobsPerDayRange={jobsPerDayRange}
                onJobsPerDayRangeChange={onJobsPerDayRangeChange}
              />
            </div>
          </div>
        )}

        {selectedSectionId === "service_zones" && (
          <div className={`${formStyle} p-2`}>
            <ServiceZoneFields
              zones={zones}
              selectedZoneIds={newTechnicianDraft.zoneIds}
              disabled={isPending}
              onChange={onZoneIdsChange}
            />
          </div>
        )}

        {selectedSectionId === "skills" && (
          <div className={`${formStyle} p-2`}>
            <SkillFields
              skills={newTechnicianDraft.skills}
              onChange={onSkillsChange}
              units={units}
              unitsById={unitsById}
              brandGroups={brandGroups}
              brandGroupById={brandGroupById}
              specificIssues={specificIssues}
              specificIssuesById={specificIssuesById}
              disabled={isPending}
              templates={SKILL_TEMPLATES}
              allowClearAll
            />
          </div>
        )}

        {selectedSectionId === "ignore_list" && (
          <div className={`${formStyle} p-2`}>
            <IgnoreListFields
              items={newTechnicianDraft.ignoreList}
              onChange={onIgnoreListChange}
              units={units}
              unitsById={unitsById}
              brands={brands}
              brandsById={brandsById}
              specificIssues={specificIssues}
              specificIssuesById={specificIssuesById}
              disabled={isPending}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default NewTechnicianForm;
