export interface interviewScheduleModel {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  candidateId: string;
  interviewerId: string;
  interviewRoundId: string;
  candidateName: string;
  candidateEmail:string;
  candidateResume:string;
  interviewerName: string;
  interviewRound: string;
  eventId: string;
  googleMeetLink: string;
}
