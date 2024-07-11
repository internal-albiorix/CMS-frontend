export interface inquiriesDataModel {
    id: number;
    fullName: string;
    email: string;
    mobileNumber: string;
    technologyIds: Array<string>;
    experience: string;
    resumeFile: string;
    resume?: string;
    inquiriesTechnologies?: Array<{ technologyId: string }>;
  }