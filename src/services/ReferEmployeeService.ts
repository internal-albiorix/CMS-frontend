import {
  deleteApi,
  downloadApi,
  getApi,
  insertApi,
  updateApi,
} from "../common/Api/Api";
// import { saveAs } from 'file-saver';

const getReferEmployeeTableData = async () => {
  let res = await getApi("Referemployee/GetAllReferemployee");
  return res;
};

const addEditReferEmployee = async (postData: any) => {
  let res;
  if (!postData.get("Id")) {
    res = await insertApi("Referemployee/CreateReferemployee", postData);
  } else {
    res = await updateApi("Referemployee/UpdateReferemployee", postData);
  }

  return res;
};

const deleteReferEmployee = async (id: number) => {
  let res = await deleteApi("Referemployee/DeleteReferemployee", id);
  return res;
};

const downloadResume = async (fileName: string) => {
  let res = await downloadApi("Referemployee/DownloadResume", fileName);
  return res;
};

export {
  getReferEmployeeTableData,
  addEditReferEmployee,
  deleteReferEmployee,
  downloadResume,
};
