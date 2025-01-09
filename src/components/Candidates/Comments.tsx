import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import {
  getCandidateHistoryById,
  insertUpdateCandidateHistory,
} from "../../services/CandidateHistoryService";
import { CandidateHistoryModel } from "../../models/CandidateHistoryModel";
import { Form, Formik } from "formik";
import TextInput from "./../../common/Controls/TextInput";
import ErrorMessage from "./../../common/Controls/ErrorMessage";

const Comments = (props: any) => {
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
  const [selectedCandidateHistoryData, setSelectedcandidateHistoryData] =
    useState<CandidateHistoryModel>({
      id: 0,
      message: "",
      candidateId: "",
    });
  const getCandidateHistoryData = async () => {
    const { data, success } = await getCandidateHistoryById(
      candidateDetailData.id
    );
    if (success) {
      const filteredData = data.filter(
        (item: any) => item.message !== null && item.message !== ""
      );
      setCandidateHistoryDataList(filteredData);
    }
  };
  const handleClickEditOpen = (rowData: CandidateHistoryModel) => {
    setSelectedcandidateHistoryData(rowData);
    setModel({ open: true, ops: "Update" });
  };

  const initialValues = {
    id: selectedCandidateHistoryData.id,
    message: selectedCandidateHistoryData.message || "",
    candidateId: selectedCandidateHistoryData.candidateId,
  };

  const validationSchema = yup.object().shape({
    message: yup.string().required("Comment is required"),
  });

  const onFormSubmit = async (values: CandidateHistoryModel) => {
    values.candidateId = candidateDetailData.id;
    let res = await insertUpdateCandidateHistory(values);
    if (res.success) {
      await getCandidateHistoryData();
      toast.success(res.message);
      values.message = "";
    } else toast.error("Something went wrong!!!");
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onFormSubmit}
        enableReinitialize
      >
        {({ touched, errors }) => (
          <Form id={"candidateHistoryDetail"}>
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
                <TextInput
                  id="commentsid"
                  label="Comment"
                  name="message"
                  multiline
                  rows={6}
                  style={{ width: "100%" }}
                />
                <ErrorMessage touched={touched.message} errors={errors.message} />
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<SaveIcon />}
                  type="submit"
                  style={{ marginTop: 16, marginBottom: 16, float: "right" }}
                >
                  Save
                </Button>
                <div style={{ width: "100%" }}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <b>Comments</b>
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ width: 100, boxSizing: "unset" }}
                          >
                            <b>Actions</b>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {candidateHistoryList.map((row) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.message}
                            </TableCell>
                            <TableCell align="right">
                              {" "}
                              <>
                                <IconButton
                                  onClick={() => handleClickEditOpen(row)}
                                >
                                  <Edit />
                                </IconButton>
                              </>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleModelClose}
              >
                {" "}
                Close{" "}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
      <ToastContainer autoClose={2000} closeOnClick />
    </>
  );
};

export default Comments;
