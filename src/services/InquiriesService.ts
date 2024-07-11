import {
    deleteApi,
    getApi,
    insertApi,
    updateApi,
    getByIdApi,
  } from "../common/Api/Api";
  
  const getAllInquiries = async () => {
    let res = await getApi("Inquiries/GetAllInquiries");
    return res;
  };
  
  const insertUpdateInquiries = async (postData: any) => {
    let res;
    if (postData.get("id") === "0")
      res = await insertApi("Inquiries/CreateInquiries", postData);
    else res = await updateApi("Inquiries/UpdateInquiries", postData);
    return res;
  };
  
  const deleteInquiries = async (id: number) => {
    let res = await deleteApi("Inquiries/DeleteInquiries", id);
    return res;
  };
  
  const getInquiriesById = async (id: number) => {
    let res = await getByIdApi("Inquiries/GetInquiriesById", id);
    return res;
  };
  
  const insertCandidate = async (postData: any) => {
    let res;
      res = await insertApi("Candidate/CreateCandidate", postData);
    return res;
  };
  
  
 
  export {
    getAllInquiries,
    insertUpdateInquiries,
    deleteInquiries,
    getInquiriesById,
    insertCandidate
  };
  