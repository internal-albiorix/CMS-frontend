import React, { useState, useCallback, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { EditingState, ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
  AppointmentForm,
  AppointmentTooltip,
  ConfirmationDialog,
  EditRecurrenceMenu,
  DayView,
} from "@devexpress/dx-react-scheduler-material-ui";
import Box from "@mui/material/Box";
import Title from "./../../common/Title/TItle";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import CustomAppointmentForm, {
  CustomDatePicker,
  CustomLabel,
  CustomTextBox,
} from "./CustomAppointmentForm";
import { interviewScheduleModel } from "../../models/InterviewScheduleModel";
import {
  getAllInterviewSchedule,
  insertUpdateInterviewSchedule,
  deleteInterviewSchedule,
} from "../../services/InterviewScheduleService";
import { getSecureLocalStorage, setSecureLocalStorage } from "../../helpers/SecureLocalStorage";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from "./GoogleAuth";
import { generateEventDescription } from "./EmailDescription";
import { candidateDataModel } from "../../models/CandidateModel";
import { getAppointMentsCandidate } from "../../services/CandidateService";
const clientId =process.env.REACT_APP_CLIENT_ID;
const discoveryDocs = [process.env.REACT_APP_DISCOVERY_DOCS];
const location = process.env.REACT_APP_LOCATION;
const timeZone = process.env.REACT_APP_TIMEZONE;


const ScheduleCalander: React.FC = () => {
  const roles = getSecureLocalStorage("role");
  const [data, setData] = useState<interviewScheduleModel[]>([]);
  const [interviewScheduleDetail, setInterviewScheduleDetail] = useState<any>(null);
  const [candidateDataList, setCandidateDataList] = useState<
    candidateDataModel[]
  >([]);
  const { accessToken, checkTokenValidity, login } = useGoogleAuth();
  useEffect(() => {
    getCandidateForAppointMents();
    getInterviewScheduleList();
  }, []);

  const TimeTableCell = (props: any) => {
    return <DayView.TimeTableCell {...props} style={{ height: 140 }} />;
  };
  const TimeLabel = (props: any) => {
    return <DayView.TimeScaleLabel {...props} style={{ height: 135 }} />;
  };
  const TickCell = (props: any) => {
    return <DayView.TimeScaleTickCell {...props} style={{ height: 140 }} />;
  };
  const getCandidateForAppointMents = async () => {
    const { data, success } = await getAppointMentsCandidate();
    if (success) {
      setCandidateDataList(data);
    }
  };


  const getInterviewScheduleList = async () => {
    const { data, success } = await getAllInterviewSchedule();
    if (success) {
      const appointmentsData = data.map((item: any) => ({
        id: item.id,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        title: item.title,
        candidateId: item.candidateId,
        interviewerId: item.interviewerId,
        interviewRoundId: item.interviewRoundId,
        candidateName: item.candidateModel?.fullName,
        candidateEmail: item.candidateModel?.email,
        candidateResume: item.candidateModel?.resume,
        interviewerName: item.interviewerModel?.fullName,
        interviewRound: item.interviewRoundModel?.interviewRoundName,
        eventId: item.eventId,
        googleMeetLink: item.gooleMeetLink
      }));

      setData(appointmentsData);
    }
  };
  const [currentDate, setCurrentDate] = useState(Date().toLocaleString());
  const [addedAppointment, setAddedAppointment] = useState({});
  const [appointmentChanges, setAppointmentChanges] = useState({});
  const [editingAppointment, setEditingAppointment] = useState<undefined | any>(
    undefined
  );

  const CustomAppointmentDisplayTemplate: React.FC<
    Appointments.AppointmentProps
  > = (props) => {
    const { children, data, draggable, resources, onClick, onDoubleClick } =
      props;

    return (
      <>
        <Appointments.Appointment
          children={children}
          data={data}
          draggable={draggable}
          resources={resources}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={{
            backgroundColor: "rgb(3, 155, 229)",
            height: "100%",
          }}
        />
      </>
    );
  };

  const CustomAppointmentContent: React.FC<
    Appointments.AppointmentContentProps
  > = (props) => {
    const {
      children,
      data,
      recurringIconComponent,
      type,
      formatDate,
      durationType,
      resources,
    } = props;

    return (
      <>
        <Appointments.AppointmentContent
          children={children}
          data={data}
          recurringIconComponent={recurringIconComponent}
          resources={resources}
          type={type}
          formatDate={formatDate}
          durationType={durationType}
        />
        {data.candidateName != null ? (
          <div
            style={{
              color: "White",
              marginLeft: 8,
              marginTop: 10,
              fontWeight: "bold",
            }}
          >
            Candidate: {data.candidateName}
          </div>
        ) : (
          ""
        )}
        {data.interviewerName != null ? (
          <div style={{ color: "White", marginLeft: 8, fontWeight: "bold" }}>
            Interview By: {data.interviewerName}
          </div>
        ) : (
          ""
        )}
        {data.interviewRound != null ? (
          <div style={{ color: "White", marginLeft: 8, fontWeight: "bold" }}>
            Round: {data.interviewRound}
          </div>
        ) : (
          ""
        )}
      </>
    );
  };

  const currentDateChange = (newDate: any) => {
    setCurrentDate(newDate);
  };

  const changeAppointmentChanges = (newChanges: any) => {
    setAppointmentChanges(newChanges);
  };

  const AddAppointment = (newChanges: any) => {
    setAddedAppointment(newChanges);
  };

  const EditAppointmentFun = (newChanges: any) => {
    setEditingAppointment(newChanges);
  };

  const insertUpdateInterviewScheduleOp = async (
    values: interviewScheduleModel
  ) => {
    let res = await insertUpdateInterviewSchedule(values);
    if (res.success) {
      toast.success(res.message);
      await getInterviewScheduleList();
    } else toast.error("Something went wrong!!!");
  };

  const createOrUpdateEvent = async () => {
    await window.gapi.load('client', async () => {
      await window.gapi.client.init({
        discoveryDocs:discoveryDocs,
      });
      window.gapi.client.setToken({ access_token: accessToken });

      let request;
      const { isDelete, data: { id, title, startDate, endDate, eventId, candidateId } } = interviewScheduleDetail;
      if (isDelete) {
        if (eventId) {
          request = window.gapi.client.calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
            sendUpdates: 'all', 
          });
          request.execute((response:any) => {
            console.log('Event deleted:', response);
            deleteInterviewScheduleop(interviewScheduleDetail.data.id);
          });
        } else {
          toast.error('Event ID not found for deletion');
        }
      } else {
        const candidate = candidateDataList.find(c => c.id === candidateId);
        const eventDescription = generateEventDescription(candidate?.fullName);
        const event = {
          summary: title,
          location: location,
          description: eventDescription,
          start: {
            dateTime: startDate.toISOString(),
            timeZone: timeZone,
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: timeZone,
          },
          conferenceData: {
            createRequest: {
              requestId: `interview-${Date.now()}`,
            },
          },
          attendees: [
            { email: candidate?.email }
          ],
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 10 }
            ]
          },
        };
        if (parseInt(interviewScheduleDetail.data.id) > 0) {
          request = window.gapi.client.calendar.events.update({
            calendarId: 'primary',
            eventId: eventId,
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: 'all',
          });
        }
        else {
          request = window.gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: 'all',
          });
        }
        request.execute((event: any) => {
          interviewScheduleDetail.data.eventId = event.id;
          interviewScheduleDetail.data.googleMeetLink = event.conferenceData.entryPoints[0].uri;
          insertUpdateInterviewScheduleOp(interviewScheduleDetail.data);
          setInterviewScheduleDetail(null);
        });
      }

    });
  };
  const deleteInterviewScheduleop = async (appointmentId: number) => {
    let res = await deleteInterviewSchedule(appointmentId);
    if (res.success) {
      toast.success(res.message);
    } else toast.error("Something went wrong!!!");
  };

  useEffect(() => {
    if (interviewScheduleDetail != null) {
      if (!checkTokenValidity()) {
        login();
      }
      else
        createOrUpdateEvent();
    }

  }, [interviewScheduleDetail, accessToken]);

  const commitChanges = useCallback(
    (changes: any) => {
      setData((prevData: any) => {
        let updatedData = [...prevData];
        if (changes.added) {
          // const startingAddedId =
          //   prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 0;
          const newInterviewSchedule = {
            // id: startingAddedId,
            ...changes.added,
          };
          setInterviewScheduleDetail({
            data: { ...newInterviewSchedule },
            isDelete: false,
          });
          updatedData = [...updatedData, newInterviewSchedule];
          //  createOrUpdateEvent();
          //insertUpdateInterviewScheduleOp(newInterviewSchedule);

        }
        if (changes.changed) {
          updatedData = updatedData.map((appointment) =>
            changes.changed[appointment.id]
              ? { ...appointment, ...changes.changed[appointment.id] }
              : appointment
          );

          const updateAppointment = updatedData.find(
            (x) => changes.changed[x.id]
          );
          setInterviewScheduleDetail({
            data: { ...updateAppointment },
            isDelete: false,
          });
          //createOrUpdateEvent();
          // insertUpdateInterviewScheduleOp(updateAppointment);
        }
        if (changes.deleted !== undefined) {

          let deletedData = updatedData.find(
            (appointment) => appointment.id === changes.deleted
          );
          updatedData = updatedData.filter(
            (appointment) => appointment.id !== changes.deleted
          );

          setInterviewScheduleDetail({
            data: { ...deletedData },
            isDelete: true,
          });

          // deleteInterviewScheduleop(changes.deleted);
        }
        return updatedData;
      });
    },
    [setData]
  );

  return (
    <>
      <Title titleName="Schedule Interview" />
      <Box
        sx={{
          height: "45px",
        }}
      >
        <Paper>
          <Scheduler data={data}>
            <ViewState
              currentDate={currentDate}
              onCurrentDateChange={currentDateChange}
            />
            <EditingState
              onCommitChanges={commitChanges}
              addedAppointment={addedAppointment}
              onAddedAppointmentChange={AddAppointment}
              appointmentChanges={appointmentChanges}
              onAppointmentChangesChange={changeAppointmentChanges}
              editingAppointment={editingAppointment}
              onEditingAppointmentChange={EditAppointmentFun}
            />
            <WeekView
              excludedDays={[0, 6]}
              startDayHour={9}
              endDayHour={22}
              timeTableCellComponent={TimeTableCell}
              timeScaleLabelComponent={TimeLabel}
              timeScaleTickCellComponent={TickCell}
            />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <EditRecurrenceMenu />
            <ConfirmationDialog />
            <Appointments
              appointmentComponent={CustomAppointmentDisplayTemplate}
              appointmentContentComponent={CustomAppointmentContent}
            />
            {roles != null && roles !== "3" ? (
              <>
                <AppointmentTooltip showOpenButton showDeleteButton />
                <AppointmentForm
                  basicLayoutComponent={CustomAppointmentForm}
                  textEditorComponent={CustomTextBox}
                  labelComponent={CustomLabel}
                  dateEditorComponent={CustomDatePicker}
                />
              </>
            ) : (
              ""
            )}
          </Scheduler>
        </Paper>
      </Box>
      <ToastContainer autoClose={2000} closeOnClick />
    </>
  );
};
const ScheduleInterview = () => (
  <GoogleOAuthProvider clientId={clientId||''}>
    <ScheduleCalander />
  </GoogleOAuthProvider>
);

export default ScheduleInterview;
