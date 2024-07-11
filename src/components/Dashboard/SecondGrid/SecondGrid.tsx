import React, { useState, useEffect } from "react";
import "./SecondGrid.css";
import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
} from "@mui/material";

import { candidateDataModel } from "../../../models/CandidateModel";
import {
  getAllLatestCandidate,
  getUpComingInterviewCandidate,
} from "../../../services/DashboardService";
import { interviewScheduleModel } from "../../../models/InterviewScheduleModel";

const SecondGrid: React.FC = () => {
  const [candidateData, setCandidateData] = useState<candidateDataModel[]>([]);
  const [upcomingInterviewData, setUpcomingInterviewData] = useState<
    interviewScheduleModel[]
  >([]);
  useEffect(() => {
    getLatestCandidateData();
    getUpComingInterviewData();
  }, []);
  const getLatestCandidateData = async () => {
    const { data, success } = await getAllLatestCandidate();
    if (success) {
      setCandidateData(data);
    }
  };
  const getUpComingInterviewData = async () => {
    const { data, success } = await getUpComingInterviewCandidate();
    if (success) {
      setUpcomingInterviewData(data);
    }
  };
  const getTechnologyName = (row: any) => {
    const technologyDataModel = row.candidateTechnologies.map(
          (techName: any) => techName.technology.technologyName
        );
    return technologyDataModel.join(", ");
  };
  const getInterviewDate = (interviewData: any) => {
    const formattedDate = new Date(interviewData).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      hourCycle: "h12",
    });
    return formattedDate;
  };
  return (
    <Grid container spacing={3} className="secondGrid">
      <Grid item xs={12} sm={6} md={6}>
        <Card variant="outlined" className="eachCard">
          <span className="tableTitle">Latest Candidates</span>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Mobile No.</TableCell>
                  <TableCell>Technology</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {candidateData.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell> {row.fullName} </TableCell>
                    <TableCell> {row.mobileNumber} </TableCell>
                    <TableCell>{getTechnologyName(row)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={6}>
        <Card variant="outlined" className="eachCard">
          <span className="tableTitle">Interviews Schedule</span>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Candidate Name</TableCell>
                  {/* <TableCell>Interviewer Name</TableCell> */}
                  <TableCell>Schedule Date</TableCell>
                  <TableCell>Round</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingInterviewData.map((row: any) => (
                  <TableRow key={row.id}>
                    <TableCell> {row.candidateModel.fullName} </TableCell>
                    {/* <TableCell>{row.interviewerModel.fullName}</TableCell> */}
                    <TableCell>{getInterviewDate(row.startDate)}</TableCell>
                    <TableCell>
                      {row.interviewRoundModel?.interviewRoundName}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SecondGrid;
