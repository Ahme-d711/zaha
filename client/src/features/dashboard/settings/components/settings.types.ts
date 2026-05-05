export interface SettingsFormState {
  contactEmail: string;
  contactPhone: string;
  shippingCost: number;
  taxRate: number;
  freeShippingThreshold: number;
  currency: string;
}

export const defaultSettingsFormState: SettingsFormState = {
  contactEmail: "",
  contactPhone: "",
  shippingCost: 0,
  taxRate: 0,
  freeShippingThreshold: 0,
  currency: "EGP",
};
