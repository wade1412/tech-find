import { useMemo, useState } from "react";
import type { IgnoreItemDraft } from "../../features/technician-management/ignore-list/model/ignoreList.types";
import type {
  CapabilityFieldKey,
  JobsPerDayDraft,
  ProfileFieldKey,
  TechnicianFormState,
} from "../../features/technician-management/profile-and-capabilities/model/profile.types";
import type { SkillDraft } from "../../features/technician-management/skills/model/skills.types";
import PageHeader from "../../shared/ui/PageHeader";
import { formStyle, primaryButton } from "../../shared/styles/styles";
import { validateProfileForm } from "../../features/technician-management/profile-and-capabilities/model/profile.validation";
import {
  editSections,
  type EditSectionId,
} from "../../features/technician-management/model/editSections.constants";
import EditTechnicianSectionCard from "./EditTechnicianSectionCard";
import TechnicianActiveBar from "../../features/technician-management/profile-and-capabilities/ui/TechnicianActiveBar";
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

const createEmptyTechnicianDraft = (): NewTechnicianDraft => ({
  profile: {
    active: true,
    alias: "",
    can_service_built_in: false,
    can_service_stacked_dryer: false,
    can_service_stacked_washer: false,
    commercial: false,
    gas: false,
    home_zip_code: "",
    jobs_per_day: "1-9",
    name: "",
    notes: "",
  },
  zoneIds: [],
  skills: [],
  ignoreList: [],
});

type NewTechnicianDraft = {
  profile: TechnicianFormState;
  zoneIds: string[];
  skills: SkillDraft[];
  ignoreList: IgnoreItemDraft[];
};

function NewTechnicianForm({
  units,
  unitsById,
  brandGroups,
  brandGroupById,
  specificIssues,
  specificIssuesById,
  zones,
}: NewTechnicianFormProps) {
  const [newTechnicianDraft, setNewTechnicianDraft] =
    useState<NewTechnicianDraft>(() => createEmptyTechnicianDraft());
  const [selectedSectionId, setSelectedSectionId] =
    useState<EditSectionId>("profile");

  // ----- Profile Section Handlers -----
  const toggleActive = () =>
    setNewTechnicianDraft((prev) => ({
      ...prev,
      profile: { ...prev.profile, active: !prev.profile.active },
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

  // false for now, update when mutation will be connected
  const isPending = false;

  //Profile is valid, if error object from validate helper has no values
  const isValidProfile = !Object.values(
    validateProfileForm(newTechnicianDraft.profile),
  ).some(Boolean);
  const canSubmitNewTechnician =
    isValidProfile &&
    newTechnicianDraft.zoneIds.length > 0 &&
    newTechnicianDraft.skills.length > 0;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <section className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <PageHeader
            title="New Technician"
            subtitle="Fill out the sections to create the new technician"
          />

          <button disabled={!canSubmitNewTechnician} className={primaryButton}>
            Submit Technician
          </button>
        </div>

        {/* Sections Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {editSections.map((section) => (
            <EditTechnicianSectionCard
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
            <TechnicianActiveBar
              isActive={newTechnicianDraft.profile.active}
              isDisabled={isPending}
              toggleActive={toggleActive}
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
            />
          </div>
        )}

        {/*
        {selectedSectionId === "ignore_list" && (
          <IgnoreListSection
            key={"New Technician Ignore List"}
            technician={selectedTechnician}
          />
        )}
        */}
      </section>
    </div>
  );
}

export default NewTechnicianForm;
