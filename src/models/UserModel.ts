import { designationDataModel } from "./DesignationModel";
import { technologyDataModel } from "./TechnologyModel";

export interface userDataModel {
  id: number;
  fullName: string;
  mobileNumber: string;
  email: string;
  designationId: string;
  technologyIds: Array<string>;
  role: number;
  status: string;
  password: string;
  confirmPassword?: string;
}

export interface getuserDataModel {
  id: number;
  fullName: string;
  mobileNumber: string;
  email: string;
  designationModel: designationDataModel;
  technologyModel: Array<technologyDataModel>;
  role: number;
  status: string;
}
