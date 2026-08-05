export type ZoneFieldKey = "name" | "slug" | "display_order";

export type EditableZoneKey = "active" | ZoneFieldKey;

export interface ZoneFormState {
  active: boolean;
  display_order: string;
  name: string;
  slug: string;
}

export type ZoneFormErrors = Partial<Record<EditableZoneKey, string>>;
