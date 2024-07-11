import {
  deleteApi,
  getApi,
  insertApi,
  updateApi,
  getByIdApi,
} from "../common/Api/Api";
import { postStatusDataModel } from "../models/StatusModel";

const getAllStatus = async (apiEndPoint: string) => {
  let res = await getApi(apiEndPoint);
  return res;
};

const insertUpdateStatus = async (data: postStatusDataModel) => {
  let res;
  if (!data.id) res = await insertApi("Status/CreateStatus", data);
  else res = await updateApi("Status/UpdateStatus", data);
  return res;
};

const deleteStatus = async (id: number) => {
  let res = await deleteApi("Status/DeleteStatus", id);
  return res;
};

const getStatusById = async (apiEndPoint: string, id: number) => {
  let res = await getByIdApi(apiEndPoint, id);
  return res;
};

export { getAllStatus, insertUpdateStatus, deleteStatus, getStatusById };
