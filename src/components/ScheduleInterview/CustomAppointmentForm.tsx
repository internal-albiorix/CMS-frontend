import React, { useEffect, useState } from "react";
import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import { candidateDataModel } from "../../models/CandidateModel";
import { getAppointMentsCandidate } from "../../services/CandidateService";
import { getInterviewerCount } from "../../services/DashboardService";
import { getAllInterviewRound } from "../../services/InterviewRoundService";
import { userDataModel } from "../../models/UserModel";
import { InterviewRoundDataModel } from "../../models/InterviewRoundModel";

const CustomTextBox = (props: any) => {
  const { placeholder, ...otherProps } = props;
  if (placeholder === "Title") {
    return (
      <AppointmentForm.TextEditor
        placeholder={placeholder === "Title" ? "Meeting Title" : placeholder}
        {...otherProps}
      />
    );
  }
  if (placeholder === "Notes") {
    return null;
  } else {
    return <AppointmentForm.TextEditor {...props} />;
  }
};

const CustomLabel = (props: any) => {
  if (props.text === "-") {
    return (
      <AppointmentForm.Label
        text="-"
        style={{ marginLeft: 31, marginRight: 31 }}
      />
    );
  }
  return null;
};

const CustomDatePicker = (props: any) => {
  return <AppointmentForm.DateEditor {...props} />;
};
export { CustomTextBox, CustomLabel, CustomDatePicker };

const CustomAppointmentForm: React.FC<{
  onFieldChange: any;
  appointmentData: any;
  dateEditorComponent: any;
  textEditorComponent: any;
  locale: any;
  appointmentResources: any;
  resources: any;
  labelComponent: any;
  selectComponent: any;
  getMessage: (messageKey: string) => string;
}> = ({
  onFieldChange,
  appointmentData,
  dateEditorComponent,
  textEditorComponent,
  locale,
  appointmentResources,
  resources,
  labelComponent,
  selectComponent,
  getMessage,
}) => {
  const oncandidateFieldChange = (nextValue: any) => {
    onFieldChange({ candidateId: nextValue });
  };

  const oninterviewRoundFieldChange = (nextValue: any) => {
    onFieldChange({ interviewRoundId: nextValue });
  };

  const oninterviewerFieldChange = (nextValue: any) => {
    onFieldChange({ interviewerId: nextValue });
  };
  const [candidateDataList, setCandidateDataList] = useState<
    candidateDataModel[]
  >([]);
  const [InterviewerDataList, setInterviewerDataList] = useState<
    userDataModel[]
  >([]);
  const [InterviewRoundDataList, setInterviewRoundDataList] = useState<
    InterviewRoundDataModel[]
  >([]);
  useEffect(() => {
    getCandidateForAppointMents();
    getInterviewerList();
    getInterviewRoundList();
  }, []);
  const getCandidateForAppointMents = async () => {
    const { data, success } = await getAppointMentsCandidate();
    if (success) {
      setCandidateDataList(data);
    }
  };

  const getInterviewerList = async () => {
    const { data, success } = await getInterviewerCount();
    if (success) {
      setInterviewerDataList(data);
    }
  };

  const getInterviewRoundList = async () => {
    const { data, success } = await getAllInterviewRound();
    if (success) {
      setInterviewRoundDataList(data);
    }
  };
  const CandidateDataList = [
    { text: "--select--", id: "0" },
    ...candidateDataList.map((item) => ({ text: item.fullName, id: item.id })),
  ];

  const interviewerDataList = [
    { text: "--select--", id: "0" },
    ...InterviewerDataList.map((item) => ({
      text: item.fullName,
      id: item.id,
    })),
  ];
  const interviewRoundDataList = [
    { text: "--select--", id: "0" },
    ...InterviewRoundDataList.map((item) => ({
      text: item.interviewRoundName,
      id: item.id,
    })),
  ];
  return (
    <div>
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        appointmentResources={appointmentResources}
        resources={resources}
        fullSize={false}
        getMessage={getMessage}
        locale={locale}
        textEditorComponent={textEditorComponent}
        dateEditorComponent={dateEditorComponent}
        booleanEditorComponent={() => null}
        selectComponent={selectComponent}
        resourceEditorComponent={() => null}
        labelComponent={labelComponent}
      >
        <>
          <AppointmentForm.Label
            text="Candidate"
            type="titleLabel"
            style={{ marginTop: 12 }}
          />
          <AppointmentForm.Select
            value={appointmentData.candidateId ?? "0"}
            onValueChange={oncandidateFieldChange}
            availableOptions={CandidateDataList}
            type="outlinedSelect"
          />
          <AppointmentForm.Label
            text="Interview Round"
            type="titleLabel"
            style={{ marginTop: 12 }}
          />
          <AppointmentForm.Select
            value={appointmentData.interviewRoundId ?? "0"}
            onValueChange={oninterviewRoundFieldChange}
            availableOptions={interviewRoundDataList}
            type="outlinedSelect"
          />
          <AppointmentForm.Label
            text="Interviewer"
            type="titleLabel"
            style={{ marginTop: 12 }}
          />
          <AppointmentForm.Select
            value={appointmentData.interviewerId ?? "0"}
            onValueChange={oninterviewerFieldChange}
            availableOptions={interviewerDataList}
            type="outlinedSelect"
          />
        </>
      </AppointmentForm.BasicLayout>
    </div>
  );
};

export default CustomAppointmentForm;
