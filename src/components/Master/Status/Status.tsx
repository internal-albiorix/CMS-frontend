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
  Checkbox,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Add from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Title from "../../../common/Title/TItle";
import TextInput from "../../../common/Controls/TextInput";
import DialogModal from "../../../common/Controls/Dialog";
import {
  deleteStatus,
  getAllStatus,
  insertUpdateStatus,
} from "../../../services/StatusService";
import {
  selectStatusDataModel,
  postStatusDataModel,
} from "../../../models/StatusModel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorMessage from "../../../common/Controls/ErrorMessage";

const Status: React.FC = () => {
  const [StatusData, setStatusData] = useState<selectStatusDataModel[]>([]);
  const [selectedStatusData, setSelectedStatusData] =
    useState<postStatusDataModel>({
      id: 0,
      statusName: "",
      statusDescription: "",
      displayInAppointSchedule: false,
    });
  const [model, setModel] = useState<{ open: boolean; ops: string }>({
    open: false,
    ops: "",
  });
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    getStatusData();
  }, []);

  const getStatusData = async () => {
    const { data, success } = await getAllStatus("Status/GetAllStatus");
    if (success) {
      setStatusData(data);
    }
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

  const handleClickEditOpen = (rowData: postStatusDataModel) => {
    setSelectedStatusData(rowData);
    setModel({ open: true, ops: "Update" });
  };

  const handleClickDeleteOpen = (rowData: postStatusDataModel) => {
    setSelectedStatusData(rowData);
    setModel({ open: true, ops: "Delete" });
  };

  const columns: GridColDef[] = [
    {
      field: "statusName",
      headerName: "Name",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "statusDescription",
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
        if (
          params.row.statusName !== "New" &&
          params.row.statusName !== "Selected" &&
          params.row.statusName !== "In Progress"
        ) {
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
        }
      },
    },
  ];

  const StatusOpsModal = () => {
    const handleModelClose = () => {
      setModel({ open: false, ops: "" });
      setSelectedStatusData({
        id: 0,
        statusName: "",
        statusDescription: "",
        displayInAppointSchedule: false,
      });
    };

    const validationSchema = yup.object().shape({
      statusName: yup.string().max(30).required("Status name required"),
    });

    const initialValues = {
      id: selectedStatusData.id,
      statusName: selectedStatusData.statusName || "",
      statusDescription: selectedStatusData.statusDescription || "",
      displayInAppointSchedule:
        selectedStatusData.displayInAppointSchedule || false,
    };

    const onFormSubmit = async (values: postStatusDataModel) => {
      let res;
      if (model.ops === "Save" || model.ops === "Update")
        res = await insertUpdateStatus(values);
      else res = await deleteStatus(values.id);

      if (res.success) {
        await getStatusData();
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
        {({touched, errors}) => (
        <Form id={`${model.ops}Status`}>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {model.ops} Status
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
                  <TextInput label="Status Name" name="statusName" />
                  <ErrorMessage touched={touched.statusName} errors={errors.statusName} />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    label="Status Description"
                    name="statusDescription"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field type="checkbox" name="displayInAppointSchedule" />
                  Display In Appoint Schedule
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
            <Button
              variant="contained"
              color="error"
              startIcon={<SaveIcon />}
              type="submit"
            >
              {model.ops}
            </Button>
          </DialogActions>
        </Form>
        )}
      </Formik>
    );
  };

  return (
    <div className="StatusWrapper">
      <Title titleName="Status" />
      <DataGrid
        sx={{ p: 1 }}
        disableColumnMenu
        disableSelectionOnClick
        headerHeight={60}
        density="standard"
        rows={StatusData}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[8, 16, 24]}
        getRowId={(row) => row.id}
        components={{ Toolbar: QuickSearchToolbar }}
        autoHeight={true}
      />

      <DialogModal modelOps={model} setModelOps={setModel}>
        <StatusOpsModal />
      </DialogModal>

      <ToastContainer autoClose={2000} closeOnClick />
    </div>
  );
};

export default Status;
