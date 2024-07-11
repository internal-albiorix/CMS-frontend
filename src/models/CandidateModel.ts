export interface candidateDataModel {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  technologyIds: Array<string>;
  experience: string;
  statusId: string;
  resumeFile: string;
  resume?: string;
}
