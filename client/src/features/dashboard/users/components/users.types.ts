export interface UserFormState {
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
}

export const defaultUserFormState: UserFormState = {
  name: "",
  email: "",
  phone: "",
  role: "user",
  isActive: true,
};
