import { deleteApi, getApi, insertApi, updateApi } from "../common/Api/Api";
import { interviewScheduleModel } from "../models/InterviewScheduleModel";

const getAllInterviewSchedule = async () => {
  let res = await getApi("InterviewSchedule/GetAllInterviewSchedule");
  return res;
};

const insertUpdateInterviewSchedule = async (data: interviewScheduleModel) => {
  let res;
  if (!data.id) {
    res = await insertApi("InterviewSchedule/CreateInterviewSchedule", data);
  } else {
    res = await updateApi("InterviewSchedule/UpdateInterviewSchedule", data);
  }
  return res;
};

const deleteInterviewSchedule = async (id: number) => {
  let res = await deleteApi("InterviewSchedule/DeleteInterviewSchedule", id);
  return res;
};

export {
  getAllInterviewSchedule,
  insertUpdateInterviewSchedule,
  deleteInterviewSchedule,
};
