import { insertApi, updateApi, getByIdApi } from "../common/Api/Api";

import { CandidateHistoryModel } from "./../models/CandidateHistoryModel";

const insertUpdateCandidateHistory = async (data: CandidateHistoryModel) => {
  let res;
  if (!data.id) res = await insertApi("Candidate/InsertCandidateHistory", data);
  else res = await updateApi("Candidate/UpdateCandidateHistory", data);
  return res;
};

const getCandidateHistoryById = async (id: number) => {
  let res = await getByIdApi("Candidate/CandidateHistoryByCandidateId", id);
  return res;
};

export { insertUpdateCandidateHistory, getCandidateHistoryById };
