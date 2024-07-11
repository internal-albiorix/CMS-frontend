import { deleteApi, getApi, insertApi, updateApi, getByIdApi } from "../common/Api/Api";
import { designationDataModel } from "../models/DesignationModel";

const getAllDesignation = async () => {

    let res = await getApi("Designation/GetAllDesignation");
    return res;
};

const insertUpdateDesignation = async (data: designationDataModel) => {
    let res;
    if (!data.id)
        res = await insertApi("Designation/CreateDesignation", data);
    else
        res = await updateApi("Designation/UpdateDesignation", data);
    return res;
};


const deleteDesignation = async (id: number) => {
    let res = await deleteApi("Designation/DeleteDesignation", id);
    return res;
};


const getDesignationById = async (id: number) => {
    let res = await getByIdApi("Designation/GetDesignationById", id);
    return res;
};

export { getAllDesignation, insertUpdateDesignation, deleteDesignation, getDesignationById };
