import {
  deleteApi,
  getApi,
  insertApi,
  updateApi,
  getByIdApi,
} from "../common/Api/Api";
import { InterviewRoundDataModel } from "../models/InterviewRoundModel";

const getAllInterviewRound = async () => {
  let res = await getApi("InterviewRound/getAllInterviewRound");
  return res;
};

const insertUpdateInterviewRound = async (data: InterviewRoundDataModel) => {
  let res;
  if (!data.id)
    res = await insertApi("InterviewRound/CreateInterviewRound", data);
  else res = await updateApi("InterviewRound/UpdateInterviewRound", data);
  return res;
};

const deleteInterviewRound = async (id: number) => {
  let res = await deleteApi("InterviewRound/DeleteInterviewRound", id);
  return res;
};

const getInterviewRoundById = async (apiEndPoint: string, id: number) => {
  let res = await getByIdApi(apiEndPoint, id);
  return res;
};

export {
  getAllInterviewRound,
  insertUpdateInterviewRound,
  deleteInterviewRound,
  getInterviewRoundById,
};
