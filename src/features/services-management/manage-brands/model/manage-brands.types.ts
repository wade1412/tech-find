export interface BrandFormState {
  active: boolean;
  name: string;
  slug: string;
  group_id: string;
}

export type BrandGroupSelectOption = {
  label: string;
  value: string;
};

export interface BrandGroupFormState {
  active: boolean;
  name: string;
  slug: string;
  display_order: string;
}

export type BrandFormErrors = Partial<Record<keyof BrandFormState, string>>;

export type BrandGroupFormErrors = Partial<
  Record<keyof BrandGroupFormState, string>
>;
