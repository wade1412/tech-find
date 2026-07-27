export type UnitProfileFieldKey = "name" | "slug" | "display_order";

export type UnitPropertyFieldKey =
  | "can_be_commercial"
  | "can_be_gas"
  | "can_be_stacked"
  | "is_built_in";

export type EditableUnitKey =
  | "active"
  | UnitProfileFieldKey
  | UnitPropertyFieldKey;

export type UnitProfileFieldConfig = {
  key: UnitProfileFieldKey;
  label: string;
};

export type UnitPropertyFieldConfig = {
  key: UnitPropertyFieldKey;
  label: string;
};

export interface UnitFormState {
  active: boolean;
  can_be_commercial: boolean;
  can_be_gas: boolean;
  can_be_stacked: boolean;
  display_order: string;
  is_built_in: boolean;
  name: string;
  slug: string;
}

export type UnitFormErrors = Partial<
  Record<UnitProfileFieldKey, string>
>;
