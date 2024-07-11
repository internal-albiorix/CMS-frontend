import {
  deleteApi,
  getApi,
  insertApi,
  updateApi,
  getByIdApi,
} from "../common/Api/Api";
import { ChangePasswordModel } from "../models/ChangePasswordModel";
import { userDataModel } from "../models/UserModel";

const getAllUsers = async () => {
  let res = await getApi("User/GetAllUsers");
  return res;
};

const insertUpdateUser = async (data: userDataModel) => {
  debugger;
  let res;
  if (!data.id) res = await insertApi("User/CreateUser", data);
  else res = await updateApi("User/UpdateUser", data);
  return res;
};

const changedPassword = async (data: ChangePasswordModel) => {
  let res;
  if (data.id != null && data.id > 0)
    res = await updateApi("User/ChangedPassword", data);
  return res;
};

const deleteUser = async (id: number) => {
  let res = await deleteApi("User/DeleteUser", id);
  return res;
};

const getUserById = async (id: number) => {
  let res = await getByIdApi("User/GetUserById", id);
  return res;
};

export {
  getAllUsers,
  insertUpdateUser,
  deleteUser,
  getUserById,
  changedPassword,
};
