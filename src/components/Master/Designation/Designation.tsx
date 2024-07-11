import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Button, IconButton, Box } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Add from "@mui/icons-material/Add";
import Title from "../../../common/Title/TItle";
import DialogModal from "../../../common/Controls/Dialog";
import { getAllDesignation } from "../../../services/DesignationService";
import { designationDataModel } from "../../../models/DesignationModel";
import  DesignationOperations   from "./DesignationOperations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Designation: React.FC = () => {
  const [designationData, setDesignationData] = useState<
    designationDataModel[]
  >([]);
  const [selectedDesignationData, setSelectedDesignationData] =
    useState<designationDataModel>({
      id: 0,
      designationName: "",
      designationDescription: "",
    });

    const initialValues = {
        id: selectedDesignationData.id,
        designationName: selectedDesignationData.designationName || "",
        designationDescription: selectedDesignationData.designationDescription || "",
      };
  const [model, setModel] = useState<{ open: boolean; ops: string }>({
    open: false,
    ops: "",
  });
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    getDesignationData();
  }, []);

  const getDesignationData = async () => {
    const { data, success } = await getAllDesignation();
    console.log(data);
    if (success) setDesignationData(data);
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

  const handleClickEditOpen = (rowData: designationDataModel) => {
    setSelectedDesignationData(rowData);
    setModel({ open: true, ops: "Update" });
  };

  const handleClickDeleteOpen = (rowData: designationDataModel) => {
    setSelectedDesignationData(rowData);
    setModel({ open: true, ops: "Delete" });
  };

  const columns: GridColDef[] = [
    {
      field: "designationName",
      headerName: "Name",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "designationDescription",
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

  return (
    <div className="designationWrapper">
      <Title titleName="Designation" />
      <DataGrid
        sx={{ p: 1 }}
        disableColumnMenu
        disableSelectionOnClick
        headerHeight={60}
        density="standard"
        rows={designationData}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[8, 16, 24]}
        getRowId={(row) => row.id}
        components={{ Toolbar: QuickSearchToolbar }}
        autoHeight={true}
      />

      <DialogModal modelOps={model} setModelOps={setModel}>
        <DesignationOperations
          model={model}
          initialValues={initialValues}
          setModel={setModel}
          setSelectedDesignationData={setSelectedDesignationData}
          getDesignationData={getDesignationData}
        ></DesignationOperations>
      </DialogModal>

      <ToastContainer autoClose={2000} closeOnClick />
    </div>
  );
};

export default Designation;
