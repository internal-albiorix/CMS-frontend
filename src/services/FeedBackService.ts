import { getApi, insertApi, getByIdApi } from "../common/Api/Api";

import { feedBackModel } from "./../models/FeedBackModel";

const getAllFeedBacks = async () => {
  let res = await getApi("Feedback/GetAllFeedBacks");
  return res;
};

const insertFeedBack = async (data: feedBackModel) => {
  let res = await insertApi("Feedback/InsertCandidateFeedBack", data);
  return res;
};

const getFeedBackByCandidateId = async (id: number) => {
  let res = await getByIdApi("Feedback/GetFeedBackByCandidateId", id);
  return res;
};

export { getAllFeedBacks, insertFeedBack, getFeedBackByCandidateId };
