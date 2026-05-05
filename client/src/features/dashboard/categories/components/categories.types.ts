export interface CategoryFormState {
  name: string;
  description: string;
  priority: number;
  isShow: boolean;
  // Backward-compatible optional aliases to avoid stale TS cache errors.
  nameEn?: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

export const defaultCategoryFormState: CategoryFormState = {
  name: "",
  description: "",
  priority: 0,
  isShow: true,
};
