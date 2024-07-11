import {
  deleteApi,
  getApi,
  insertApi,
  updateApi,
  getByIdApi,
  sentmail
} from "../common/Api/Api";
import { currentOpeningtableDataModel } from "../models/CurrentOpeningModel";

const getAllCurrentOpenings = async (apiEndPoint: string) => {
  let res = await getApi(apiEndPoint);
  return res;
};

const insertUpdateCurrentOpening = async (
  data: currentOpeningtableDataModel
) => {
  let res;
  if (!data.id)
    res = await insertApi("CurrentOpening/CreateCurrentOpening", data);
  else res = await updateApi("CurrentOpening/UpdateCurrentOpening", data);
  return res;
};

const deleteCurrentOpening = async (id: number) => {
  let res = await deleteApi("CurrentOpening/DeleteCurrentOpening", id);
  return res;
};
const sentEmailCurrentOpening = async (type: string) => {
  let res = await sentmail("EmailTemplate/SentEmailCurrentOpening", type);
  return res;
};

const getCurrentOpeningById = async (apiEndPoint: string, id: number) => {
  let res = await getByIdApi(apiEndPoint, id);
  return res;
};

export {
  getAllCurrentOpenings,
  insertUpdateCurrentOpening,
  deleteCurrentOpening,
  getCurrentOpeningById,
  sentEmailCurrentOpening
};
