import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../Dashboard/SecondGrid/SecondGrid.css";
import {
  Button,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { getCandidateHistoryById } from "../../services/CandidateHistoryService";
import { CandidateHistoryModel } from "../../models/CandidateHistoryModel";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

const TimeLine = (props: any) => {
  const { model, setModel, candidateDetailData } = props;
  const handleModelClose = () => {
    setModel({ open: false, ops: "" });
  };
  const [candidateHistoryList, setCandidateHistoryDataList] = useState<
    CandidateHistoryModel[]
  >([]);
  useEffect(() => {
    getCandidateHistoryData();
  }, []);

  const getCandidateHistoryData = async () => {
    const { data, success } = await getCandidateHistoryById(
      candidateDetailData.id
    );
    if (success) {
      setCandidateHistoryDataList(data);
    }
  };
  return (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Candidate {model.ops}
        <IconButton
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleModelClose}
        >
          {" "}
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box>
          <div style={{ width: "100%" }}>
            <Timeline>
              {candidateHistoryList.map((row: any, index: number) => (
                <TimelineItem
                  className={
                    index % 2 === 0 ? "primary-timeline" : "secondary-timeline"
                  }
                >
                  <TimelineOppositeContent color="textSecondary">
                    {row.timeLineDate}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot
                      color={index % 2 === 0 ? "secondary" : "primary"}
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    {(function () {
                      if (row.statusId != null) {
                        return row.statusModel?.statusName;
                      } else if(row.message != null && row.interviewerId != null) {
                        const interviewerName =
                        row.interviewerId != null
                          ? row.interviewerModel?.fullName
                          : "";
                         return (
                          <span>
                          { interviewerName ? (
                            <>
                              <strong> {interviewerName}</strong>{" "}
                              <small> rejected schedule on {row.timeLineDate}</small>
                            </>
                          ) : null}
                        </span>
                         );
                      } else{
                        const roundName =
                          row.interviewRoundId != null
                            ? row.interviewRoundModel?.interviewRoundName
                            : "";
                        const interviewerName =
                          row.interviewerId != null
                            ? row.interviewerModel?.fullName
                            : "";
                        return (
                          <span>
                            {roundName}
                            {roundName && interviewerName ? (
                              <>
                                <strong> by {interviewerName}</strong>{" "}
                                <small> on {row.interviewStartDate}</small>
                              </>
                            ) : null}
                            {row.message != null ? row.message : ""}
                          </span>
                        );
                      }
                    })()}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="inherit" onClick={handleModelClose}>
          {" "}
          Close{" "}
        </Button>
      </DialogActions>
    </>
  );
};

export default TimeLine;
