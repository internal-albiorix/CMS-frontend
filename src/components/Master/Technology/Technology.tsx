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
  deleteTechnology,
  getAllTechnology,
  insertUpdateTechnology,
} from "../../../services/TechnologyService";
import { technologyDataModel } from "../../../models/TechnologyModel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorMessage from "../../../common/Controls/ErrorMessage";

const Technology: React.FC = () => {
  const [technologyData, settechnologyData] = useState<technologyDataModel[]>(
    []
  );
  const [selectedtechnologyData, setSelectedtechnologyData] =
    useState<technologyDataModel>({
      id: 0,
      technologyName: "",
      technologyDescription: "",
    });
  const [model, setModel] = useState<{ open: boolean; ops: string }>({
    open: false,
    ops: "",
  });
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    gettechnologyData();
  }, []);

  const gettechnologyData = async () => {
    const { data, success } = await getAllTechnology();
    if (success) settechnologyData(data);
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

  const handleClickEditOpen = (rowData: technologyDataModel) => {
    setSelectedtechnologyData(rowData);
    setModel({ open: true, ops: "Update" });
  };

  const handleClickDeleteOpen = (rowData: technologyDataModel) => {
    setSelectedtechnologyData(rowData);
    setModel({ open: true, ops: "Delete" });
  };

  const columns: GridColDef[] = [
    {
      field: "technologyName",
      headerName: "Name",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "technologyDescription",
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

  const TechnologyOpsModal = () => {
    const handleModelClose = () => {
      setModel({ open: false, ops: "" });
      setSelectedtechnologyData({
        id: 0,
        technologyName: "",
        technologyDescription: "",
      });
    };

    const validationSchema = yup.object().shape({
      technologyName: yup.string().max(30).required("technology name required"),
    });

    const initialValues = {
      id: selectedtechnologyData.id,
      technologyName: selectedtechnologyData.technologyName || "",
      technologyDescription: selectedtechnologyData.technologyDescription || "",
    };

    const onFormSubmit = async (values: technologyDataModel) => {
      let res;
      if (model.ops === "Save" || model.ops === "Update"){
        res = await insertUpdateTechnology(values);
      }
      else res = await deleteTechnology(values.id);

      if (res.success) {
        await gettechnologyData();
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
          <Form id={`${model.ops}technology`}>
            <DialogTitle sx={{ m: 0, p: 2 }}>
              {model.ops} Technology
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
                    <TextInput label="Technology Name" name="technologyName" />
                    <ErrorMessage touched={touched.technologyName} errors={errors.technologyName} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput
                      label="Technology Description"
                      name="technologyDescription"
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
    <div className="technologyWrapper">
      <Title titleName="Technology" />
      <DataGrid
        sx={{ p: 1 }}
        disableColumnMenu
        disableSelectionOnClick
        headerHeight={60}
        density="standard"
        rows={technologyData}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[8, 16, 24]}
        getRowId={(row) => row.id}
        components={{ Toolbar: QuickSearchToolbar }}
        autoHeight={true}
      />

      <DialogModal modelOps={model} setModelOps={setModel}>
        <TechnologyOpsModal />
      </DialogModal>

      <ToastContainer autoClose={2000} closeOnClick />
    </div>
  );
};

export default Technology;
