import {
  deleteApi,
  getApi,
  insertApi,
  updateApi,
  getByIdApi,
} from "../common/Api/Api";
import { technologyDataModel } from "../models/TechnologyModel";

const getAllTechnology = async () => {
  let res = await getApi("technology/getAllTechnology");
  return res;
};

const insertUpdateTechnology = async (data: technologyDataModel) => {
  let res;
  if (!data.id) res = await insertApi("technology/Createtechnology", data);
  else res = await updateApi("technology/Updatetechnology", data);
  return res;
};

const deleteTechnology = async (id: number) => {
  let res = await deleteApi("technology/Deletetechnology", id);
  return res;
};

const getTechnologyById = async (apiEndPoint: string, id: number) => {
  let res = await getByIdApi(apiEndPoint, id);
  return res;
};

export {
  getAllTechnology,
  insertUpdateTechnology,
  deleteTechnology,
  getTechnologyById,
};
