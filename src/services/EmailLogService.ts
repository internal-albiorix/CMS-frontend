import {
    getApi,
  } from "../common/Api/Api";

const getAllEmailLog = async () => {
    let res = await getApi("EmailTemplate/GetAllEmailLog");
    return res;
};

export {
    getAllEmailLog
};