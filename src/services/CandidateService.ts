import {
  deleteApi,
  getApi,
  insertApi,
  updateApi,
  getByIdApi,
  getReportCandidateData
} from "../common/Api/Api";
import { candidateDataModel } from "../models/CandidateModel";

const getAllCandidate = async () => {
  let res = await getApi("Candidate/GetAllCandidate");
  return res;
};

const insertUpdateCandidate = async (postData:any) => {
  let res;
  if (postData.get("id") === "0")
    res = await insertApi("Candidate/CreateCandidate", postData);
  else res = await updateApi("Candidate/UpdateCandidate", postData);
  return res;
};

const deleteCandidate = async (id: number) => {
  let res = await deleteApi("Candidate/DeleteCandidate", id);
  return res;
};

const getCandidateById = async (id: number) => {
  let res = await getByIdApi("Candidate/GetCandidateById", id);
  return res;
};

const rejectInterviewSchedule = async (id: number) => {
  let res = await getByIdApi("Candidate/RejectInterviewSchedule", id);
  return res;
};

const getAppointMentsCandidate = async () => {
  let res = await getApi("Candidate/GetAppointMentsCandidate");
  return res;
};

const getfilterCandidateData = async (timeFrame: number, selectedTechnology: string[], candidateStatus: string[], fromDate: Date | null, toDate: Date | null) => {
  let res = await getReportCandidateData("Candidate/GetReportCandidateData",timeFrame, selectedTechnology, candidateStatus, fromDate, toDate);
  return res;
};

export {
  getAllCandidate,
  insertUpdateCandidate,
  deleteCandidate,
  getCandidateById,
  getAppointMentsCandidate,
  getfilterCandidateData,
  rejectInterviewSchedule
};
