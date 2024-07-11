import { insertApi, updateApi } from "../common/Api/Api";
import { authenticationModel,ForgotPasswordModel } from "../models/AuthenticationModel";
import { ResetPasswordModel } from "../models/ChangePasswordModel";

const getUserLogin = async (data: authenticationModel) => {
  const res = await insertApi("User/Login", data);
  return res;
};

const sentEmailForgotPassword = async (data:ForgotPasswordModel ) => {
  const res = await updateApi("User/SentEmailForgotPassword", data);
  return res;
};
const ResetUserPassword = async (data:ResetPasswordModel ) => {
  const res = await updateApi("User/ResetPassword", data);
  return res;
};

export { getUserLogin ,sentEmailForgotPassword,ResetUserPassword};
