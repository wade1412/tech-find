import type { Json } from "../../../../shared/api/supabase/database.types";
import { ignoreItemDraftToInput } from "../../ignore-list/model/ignoreList.helpers";
import { skillDraftToInput } from "../../skills/model/skills.helpers";
import type {
  CreateTechnicianInput,
  NewTechnicianDraft,
} from "./newTechnician.types";

export const createEmptyNewTechnicianDraft = (): NewTechnicianDraft => ({
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

export const buildCreateTechnicianInput = (
  draft: NewTechnicianDraft,
): CreateTechnicianInput => ({
  profile: {
    active: draft.profile.active,
    alias: draft.profile.alias.trim(),
    can_service_built_in: draft.profile.can_service_built_in,
    can_service_stacked_dryer: draft.profile.can_service_stacked_dryer,
    can_service_stacked_washer: draft.profile.can_service_stacked_washer,
    commercial: draft.profile.commercial,
    gas: draft.profile.gas,
    home_zip_code: draft.profile.home_zip_code.trim(),
    jobs_per_day: draft.profile.jobs_per_day.trim(),
    name: draft.profile.name.trim(),
    notes: draft.profile.notes.trim() || null,
  } satisfies Json,
  zoneIds: draft.zoneIds,
  skills: draft.skills.map(skillDraftToInput) satisfies Json,
  ignoreItems: draft.ignoreList.map(ignoreItemDraftToInput) satisfies Json,
});
