export type UnitProfileFieldKey = "name" | "slug" | "display_order";

export type UnitPropertyFieldKey =
  | "can_be_gas"
  | "can_be_stacked"
  | "can_be_installed"
  | "is_built_in"
  | "can_be_commercial";

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
  display_order: string;
  name: string;
  slug: string;
  can_be_gas: boolean;
  can_be_stacked: boolean;
  can_be_installed: boolean;
  can_be_commercial: boolean;
  is_built_in: boolean;
}

export type UnitFormErrors = Partial<Record<UnitProfileFieldKey, string>>;
