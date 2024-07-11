export interface EmailLogModel {
    id: number;
    recipient: string;
    sentDate:Date;
    Status: string;
    ErrorMessage:boolean;
  }