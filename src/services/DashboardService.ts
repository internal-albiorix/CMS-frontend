import { getApi, getByIdApi } from "../common/Api/Api";

const getInterviewerCount = async () => {
  let res = await getApi("Dashboard/GetInterviewerList");
  return res;
};

const getCandidateCount = async (apiEndPoint: string) => {
  let res = await getApi(apiEndPoint);
  return res;
};

const getCandidateByStatusNames = async (statusNames: string) => {
  let res = await getByIdApi(
    "Dashboard/GetCandidateCountByStatus",
    statusNames
  );
  return res;
};
const getAllLatestCandidate = async () => {
  let res = await getApi("Dashboard/GetLatestCandidateList");
  return res;
};

const getUpComingInterviewCandidate = async () => {
  let res = await getApi("Dashboard/GetUpcomingInterviews");
  return res;
};

const getAllCandidatesForChart = async () => {
  let res = await getApi("Dashboard/GetCandidatesForChart");
  return res;
};

export {
  getInterviewerCount,
  getCandidateCount,
  getAllLatestCandidate,
  getUpComingInterviewCandidate,
  getAllCandidatesForChart,
  getCandidateByStatusNames,
};
