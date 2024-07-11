import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../Dashboard/SecondGrid/SecondGrid.css";
import {
  Button,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  Card,
} from "@mui/material";
import { getFeedBackByCandidateId } from "../../services/FeedBackService";
import { feedBackModel } from "./../../models/FeedBackModel";

const FeedBacksView = (props: any) => {
  const { model, setModel, candidateDetailData } = props;
  const handleModelClose = () => {
    setModel({ open: false, ops: "" });
  };
  const [candidateFeedBackList, setcandidateFeedBackList] = useState<
    feedBackModel[]
  >([]);
  useEffect(() => {
    getCandidateFeedBackData();
  }, []);

  const getCandidateFeedBackData = async () => {
    const { data, success } = await getFeedBackByCandidateId(
      candidateDetailData.id
    );
    if (success) {
      setcandidateFeedBackList(data);
    }
  };
  const getTechnologyName = (row: any) => {
    const technologyDataModel = row.technologyModel.map(
      (techName: any) => techName.technologyName
    );
    return technologyDataModel.join(", ");
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
            <Grid container spacing={4} className="secondGrid">
              <Grid item xs={12} sm={12} md={12}>
                <Card variant="outlined" className="eachCard feedbacktbl">
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Candidate Name</TableCell>
                          <TableCell>Interviewer Name</TableCell>
                          <TableCell>Experience</TableCell>
                          <TableCell>Technology</TableCell>
                          <TableCell>Recommanded for Practical</TableCell>
                          <TableCell>Round</TableCell>
                          <TableCell>Communication</TableCell>
                          <TableCell>Practical completion (0 - 100)%</TableCell>
                          <TableCell>coding standard (0 - 100)%</TableCell>
                          <TableCell>Technical Round (0 - 100)%</TableCell>
                          <TableCell>Notes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {candidateFeedBackList.map((row: any) => (
                          <TableRow key={row.id}>
                            <TableCell> {row.candidateFullName} </TableCell>
                            <TableCell>{row.interviewerFullName}</TableCell>
                            <TableCell>{row.experience}</TableCell>
                            <TableCell> {getTechnologyName(row)} </TableCell>
                            <TableCell>{row.recommandedforPractical}</TableCell>
                            <TableCell>
                              {row.interviewRoundModel?.interviewRoundName}
                            </TableCell>
                            <TableCell>{row.communication}</TableCell>
                            <TableCell> {row.practicalcompletion} </TableCell>
                            <TableCell>{row.codingstandard}</TableCell>
                            <TableCell>{row.techanicalround}</TableCell>
                            <TableCell> {row.comments} </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>
            </Grid>
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

export default FeedBacksView;
