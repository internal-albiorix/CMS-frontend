import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import {
  Button,
  IconButton,
  Grid,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Add from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import Title from "../../../common/Title/TItle";
import TextInput from "../../../common/Controls/TextInput";
import DialogModal from "../../../common/Controls/Dialog";
import {
  deleteInterviewRound,
  getAllInterviewRound,
  insertUpdateInterviewRound,
} from "../../../services/InterviewRoundService";
import { InterviewRoundDataModel } from "../../../models/InterviewRoundModel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorMessage from "../../../common/Controls/ErrorMessage";

const InterviewRound: React.FC = () => {
  const [InterviewRoundData, setInterviewRoundData] = useState<
    InterviewRoundDataModel[]
  >([]);
  const [selectedInterviewRoundData, setSelectedInterviewRoundData] =
    useState<InterviewRoundDataModel>({
      id: 0,
      interviewRoundName: "",
      interviewRoundDescription: "",
    });
  const [model, setModel] = useState<{ open: boolean; ops: string }>({
    open: false,
    ops: "",
  });
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    getInterviewRoundData();
  }, []);

  const getInterviewRoundData = async () => {
    const { data, success } = await getAllInterviewRound();
    if (success) setInterviewRoundData(data);
  };

  const QuickSearchToolbar = () => {
    return (
      <Box sx={{ height: "45px" }}>
        <Button
          sx={{ float: "right" }}
          variant="contained"
          color="error"
          onClick={handleClickInsertOpen}
          startIcon={<Add />}
        >
          Add new
        </Button>
        <GridToolbarQuickFilter
          className="muiGridSearch"
          sx={{ float: "left", width: "50%" }}
        />
      </Box>
    );
  };

  const handleClickInsertOpen = () => {
    setModel({ open: true, ops: "Save" });
  };

  const handleClickEditOpen = (rowData: InterviewRoundDataModel) => {
    setSelectedInterviewRoundData(rowData);
    setModel({ open: true, ops: "Update" });
  };

  const handleClickDeleteOpen = (rowData: InterviewRoundDataModel) => {
    setSelectedInterviewRoundData(rowData);
    setModel({ open: true, ops: "Delete" });
  };

  const columns: GridColDef[] = [
    {
      field: "interviewRoundName",
      headerName: "Name",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "interviewRoundDescription",
      headerName: "Description",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params: any) => {
        return (
          <>
            <IconButton onClick={() => handleClickEditOpen(params.row)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleClickDeleteOpen(params.row)}>
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  const InterviewRoundOpsModal = () => {
    const handleModelClose = () => {
      setModel({ open: false, ops: "" });
      setSelectedInterviewRoundData({
        id: 0,
        interviewRoundName: "",
        interviewRoundDescription: "",
      });
    };

    const validationSchema = yup.object().shape({
      interviewRoundName: yup
        .string()
        .max(30)
        .required("InterviewRound name required"),
    });

    const initialValues = {
      id: selectedInterviewRoundData.id,
      interviewRoundName: selectedInterviewRoundData.interviewRoundName || "",
      interviewRoundDescription:
        selectedInterviewRoundData.interviewRoundDescription || "",
    };

    const onFormSubmit = async (values: InterviewRoundDataModel) => {
      let res;
      if (model.ops === "Save" || model.ops === "Update")
        res = await insertUpdateInterviewRound(values);
      else res = await deleteInterviewRound(values.id);

      if (res.success) {
        await getInterviewRoundData();
        handleModelClose();
        toast.success(res.message);
      } else toast.error("Something went wrong!!!");
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onFormSubmit}
        enableReinitialize
      >
        {({ touched, errors }) => (
          <Form id={`${model.ops}InterviewRound`}>
            <DialogTitle sx={{ m: 0, p: 2 }}>
              {model.ops} Interview Round
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
              {model.ops !== "Delete" ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextInput
                      label="Interview Round Name"
                      name="interviewRoundName"
                    />
                    <ErrorMessage touched={touched.interviewRoundName} errors={errors.interviewRoundName} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput
                      label="Interview Round Description"
                      name="interviewRoundDescription"
                    />
                  </Grid>
                </Grid>
              ) : (
                <Typography gutterBottom>
                  Are you sure want to delete this record?
                </Typography>
              )}
            </DialogContent>

            <DialogActions>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleModelClose}
              >
                {" "}
                Cancel{" "}
              </Button>
              {model.ops !== "Delete" ? (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<SaveIcon />}
                  type="submit"
                >
                  {model.ops}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  type="submit"
                >
                  {model.ops}
                </Button>
              )}
            </DialogActions>
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <div className="InterviewRoundWrapper">
      <Title titleName="Interview Round" />
      <DataGrid
        sx={{ p: 1 }}
        disableColumnMenu
        disableSelectionOnClick
        headerHeight={60}
        density="standard"
        rows={InterviewRoundData}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[8, 16, 24]}
        getRowId={(row) => row.id}
        components={{ Toolbar: QuickSearchToolbar }}
        autoHeight={true}
      />

      <DialogModal modelOps={model} setModelOps={setModel}>
        <InterviewRoundOpsModal />
      </DialogModal>

      <ToastContainer autoClose={2000} closeOnClick />
    </div>
  );
};

export default InterviewRound;
