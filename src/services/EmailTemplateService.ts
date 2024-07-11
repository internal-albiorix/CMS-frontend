import {
    deleteApi,
    getApi,
    insertApi,
    updateApi,
    getByIdApi,
  } from "../common/Api/Api";
  import { EmailTemplateModel } from "../models/EmailTemplateModel";

  const insertUpdateEmailTemplate = async (data: EmailTemplateModel) => {
    let res;
    if (!data.id) res = await insertApi("EmailTemplate/CreateEmailTemplate", data);
    else res = await updateApi("EmailTemplate/UpdateEmailTemplate", data);
    return res;
  };

  const getAllEmailTemplate = async () => {

    let res = await getApi("EmailTemplate/GetAllEmailTemplate");
    return res;
};
const deleteEmailTemplate = async (id: number) => {
    let res = await deleteApi("EmailTemplate/DeleteEmailTemplate", id);
    return res;
};
  export {
    insertUpdateEmailTemplate,
    getAllEmailTemplate,
    deleteEmailTemplate
  };