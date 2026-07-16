import type { Json } from "../../../../shared/api/supabase/database.types";
import type { IgnoreItemDraft } from "../../ignore-list/model/ignoreList.types";
import type { TechnicianFormState } from "../../profile-and-capabilities/model/profile.types";
import type { SkillDraft } from "../../skills/model/skills.types";

export type NewTechnicianDraft = {
  profile: TechnicianFormState;
  zoneIds: string[];
  skills: SkillDraft[];
  ignoreList: IgnoreItemDraft[];
};

export type CreateTechnicianInput = {
  profile: Json;
  zoneIds: string[];
  skills: Json;
  ignoreItems: Json;
};
