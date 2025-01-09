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
import * as yup from "yup";
import Delete from "@mui/icons-material/Delete";
import { Form, Formik } from "formik";
import Edit from "@mui/icons-material/Edit";
import Add from "@mui/icons-material/Add";
import Email from "@mui/icons-material/Email";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Title from "../../common/Title/TItle";
import TextInput from "../../common/Controls/TextInput";
import DialogModal from "../../common/Controls/Dialog";
import {
  getAllCurrentOpenings,
  insertUpdateCurrentOpening,
  deleteCurrentOpening,
  sentEmailCurrentOpening
} from "../../services/CurrentOpeningService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { currentOpeningtableDataModel } from "./../../models/CurrentOpeningModel";
import SelectDropdown from "../../common/Controls/SelectDropdown";
import { getAllTechnology } from "../../services/TechnologyService";
import { getAllDesignation } from "../../services/DesignationService";
import { getSecureLocalStorage } from "../../helpers/SecureLocalStorage";
import { DropdownModel } from "../../models/DropdownModel";
import ErrorMessage from "../../common/Controls/ErrorMessage";

const CurrentOpening: React.FC = () => {
  const roles = getSecureLocalStorage("role");

  const [CurrentOpeningData, setCurrentOpeningData] = useState<
    currentOpeningtableDataModel[]
  >([]);
  const [selectedCurrentOpeningData, setSelectedCurrentOpeningData] =
    useState<currentOpeningtableDataModel>({
      id: 0,
      technologyId: "",
      designationId: "",
      experience: "",
      noofopening: 0,
      technologyName: "",
      designationName: "",
    });
  const [technologyData, settechnologyData] = useState<DropdownModel[]>([]);
  const [designationData, setDesignationData] = useState<DropdownModel[]>([]);
  const [model, setModel] = useState<{ open: boolean; ops: string }>({
    open: false,
    ops: "",
  });
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    getCurrentOpeningData();
  }, []);

  const getCurrentOpeningData = async () => {
    const { data, success } = await getAllCurrentOpenings(
      "CurrentOpening/GetAllCurrentOpening"
    );
    if (success) {
      setCurrentOpeningData(data);
    }
  };
  const gettechnologyData = async () => {
    const { data, success } = await getAllTechnology();
    if (success) {
      let techData = data.map((data: any) => {
        return {
          key: data.id,
          value: data.technologyName,
          text: data.technologyName,
        };
      });
      settechnologyData(techData);
    }
  };

  const getdesignationData = async () => {
    const { data, success } = await getAllDesignation();
    if (success) {
      let designationData = data.map((data: any) => {
        return {
          key: data.id,
          value: data.designationName,
          text: data.designationName,
        };
      });
      setDesignationData(designationData);
    }
  };
  const QuickSearchToolbar = () => {
    return (
      <>
        <GridToolbarQuickFilter
          className="muiGridSearch"
          sx={{ float: "left", width: "50%" }}
        />
        {roles !== "3" ? (
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
            <Button
              sx={{ float: "right", marginRight: 1 }}
              variant="contained"
              color="success"
              onClick={handleClickEmailSent}
              startIcon={<Email />}
            >
              Sent Mail
            </Button>
          </Box>
        ) : null}
      </>
    );
  };

  const handleClickInsertOpen = () => {
    setModel({ open: true, ops: "Save" });
    gettechnologyData();
    getdesignationData();
  };

  const handleClickEmailSent = async () => {
    var res = await sentEmailCurrentOpening("CurrentOpening");
    if (res.success) {
      toast.success(res.message);
    }
    else {
      toast.error(res.message);
    }
  };

  const handleClickEditOpen = (rowData: currentOpeningtableDataModel) => {
    setSelectedCurrentOpeningData(rowData);
    setModel({ open: true, ops: "Update" });
    gettechnologyData();
    getdesignationData();
  };

  const handleClickDeleteOpen = (rowData: currentOpeningtableDataModel) => {
    setSelectedCurrentOpeningData(rowData);
    setModel({ open: true, ops: "Delete" });
  };

  const columns: GridColDef[] = [
    {
      field: "technologyName",
      headerName: "Technology",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "designationName",
      headerName: "Designation",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "experience",
      headerName: "Experience",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "noofopening",
      headerName: "No Of Openings",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "action",
      headerName: "Action",
      hide: roles != null && roles !== "3" ? false : true,
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

  const CurrentOpeningOpsModal = () => {
    const handleModelClose = () => {
      setModel({ open: false, ops: "" });
      setSelectedCurrentOpeningData({
        id: 0,
        technologyId: "",
        designationId: "",
        experience: "",
        noofopening: 0,
        technologyName: "",
        designationName: "",
      });
    };
    const validationSchema = yup.object().shape({
      technologyId: yup.string().required("Technology is required"),
      designationId: yup.string().required("Designation is required"),
      experience: yup.string().required("Experience is required"),
      noofopening: yup
        .number()
        .max(100 ,"No of Opening must be less than or equal to 100")
        .min(1,"No of Opening must be greater than or equal to 1")
        .required("No of Opening is required"),
    });
    const initialValues = {
      id: selectedCurrentOpeningData.id,
      technologyId: selectedCurrentOpeningData.technologyId || "",
      designationId: selectedCurrentOpeningData.designationId || "",
      experience: selectedCurrentOpeningData.experience || "",
      noofopening: selectedCurrentOpeningData.noofopening || 0,
      designationName: selectedCurrentOpeningData.designationName || "",
      technologyName: selectedCurrentOpeningData.technologyName || "",
    };

    const onFormSubmit = async (values: currentOpeningtableDataModel) => {
      let res;
      if (model.ops === "Save" || model.ops === "Update")
        res = await insertUpdateCurrentOpening(values);
      else res = await deleteCurrentOpening(values.id);

      if (res.success) {
        await getCurrentOpeningData();
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
          <Form id={`${model.ops}CurrentOpening`}>
            <DialogTitle sx={{ m: 0, p: 2 }}>
              {model.ops} Current Opening
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
                    <SelectDropdown
                      items={technologyData}
                      label="Technology"
                      name="technologyId"
                      valueField="id"
                      showField="technologyName"
                    />
                    <ErrorMessage touched={touched.technologyId} errors={errors.technologyId} />
                  </Grid>
                  <Grid item xs={12}>
                    <SelectDropdown
                      items={designationData}
                      label="Designation"
                      name="designationId"
                      valueField="id"
                      showField="designationName"
                    />
                    <ErrorMessage touched={touched.designationId} errors={errors.designationId} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput label="Experience" name="experience" />
                    <ErrorMessage touched={touched.experience} errors={errors.experience} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput
                      label="No Of Openings"
                      name="noofopening"
                      type="number"
                    />
                    <ErrorMessage touched={touched.noofopening} errors={errors.noofopening} />
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
      <Title titleName="Current Opening" />
      <DataGrid
        sx={{ p: 1 }}
        disableColumnMenu
        disableSelectionOnClick
        headerHeight={60}
        density="standard"
        rows={CurrentOpeningData}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[8, 16, 24]}
        getRowId={(row) => row.id}
        components={{ Toolbar: QuickSearchToolbar }}
        autoHeight={true}
      />

      <DialogModal modelOps={model} setModelOps={setModel}>
        <CurrentOpeningOpsModal />
      </DialogModal>

      <ToastContainer autoClose={2000} closeOnClick />
    </div>
  );
};

export default CurrentOpening;
