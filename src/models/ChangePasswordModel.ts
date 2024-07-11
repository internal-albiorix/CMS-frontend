export interface ChangePasswordModel {
  id: number;
  password: string;
  oldPassword: string;
  confirmPassword?: string;
}

export interface ResetPasswordModel {
  token:string;
  password: string;
  confirmPassword?: string;
}
