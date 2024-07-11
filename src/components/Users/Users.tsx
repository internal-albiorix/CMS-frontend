import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Button, IconButton, Box } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Add from "@mui/icons-material/Add";
import Title from "../../common/Title/TItle";
import DialogModal from "../../common/Controls/Dialog";
import { getAllUsers } from "../../services/UserService";
import { getAllTechnology } from "../../services/TechnologyService";
import { getAllDesignation } from "../../services/DesignationService";
import { userDataModel, getuserDataModel } from "../../models/UserModel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DropdownModel } from "../../models/DropdownModel";
import UsersOperations from "./UsersOperations";
import Loader from "../../helpers/Loader";

const Users: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<getuserDataModel[]>([]);
  const [selectedUserData, setSelectedUserData] = useState<userDataModel>({
    id: 0,
    fullName: "",
    mobileNumber: "",
    email: "",
    designationId: "",
    technologyIds: [],
    role: 0,
    status: "",
    password: "",
    confirmPassword: "",
  });
  const [designationData, setDesignationData] = useState<DropdownModel[]>([]);
  const [technologyData, setTechnologyData] = useState<DropdownModel[]>([]);
  const initialValues = {
    id: selectedUserData.id || 0,
    fullName: selectedUserData.fullName || "",
    mobileNumber: selectedUserData.mobileNumber || "",
    email: selectedUserData.email || "",
    designationId: selectedUserData.designationId || "",
    technologyIds: selectedUserData.technologyIds || [],
    role: selectedUserData.role || 0,
    status: selectedUserData.status || "",
    password: selectedUserData.password || "",
    confirmPassword: selectedUserData.password || "",
  };
  const [model, setModel] = useState<{ open: boolean; ops: string }>({
    open: false,
    ops: "",
  });
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    getAllUsersData();
    getTechnologyData();
  }, []);

  const getAllUsersData = async () => {
    setLoading(true);
    const { data, success } = await getAllUsers();
    if (success) {
      setUserData(data);
    }
    setLoading(false);
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
  const getDesignationData = async () => {
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

  const getTechnologyData = async () => {
    const { data, success } = await getAllTechnology();
    if (success) {
      let technologyData = data.map((data: any) => {
        return {
          key: data.id,
          value: data.technologyName,
          text: data.technologyName,
        };
      });
      setTechnologyData(technologyData);
    }
  };

  const handleClickInsertOpen = () => {
    getDesignationData();
    getTechnologyData();
    setModel({ open: true, ops: "Save" });
  };

  const handleClickEditOpen = (rowData: userDataModel) => {
    getDesignationData();
    getTechnologyData();
    setSelectedUserData(rowData);
    setModel({ open: true, ops: "Update" });
  };

  const handleClickDeleteOpen = async (rowData: userDataModel) => {
    setSelectedUserData(rowData);
    setModel({ open: true, ops: "Delete" });
  };

  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Full Name",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      minWidth: 300,
      headerAlign: "left",
    },
    {
      field: "technology",
      headerName: "Technology",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
      renderCell(params) {
        const technologyDataModel = params.row.technologyModel.map(
          (techName: any) => techName.technologyName
        );
        return technologyDataModel.join(", ");
      },
    },
    {
      field: "role",
      headerName: "Role",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
      renderCell(params) {
        if (params.row.role == 1) {
          return "Admin";
        } else if (params.row.role == 2) {
          return "HR";
        } else {
          return "Interviewer";
        }
      },
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
    <>
    {loading && <Loader />} {/* Display loader when loading */}
    {!loading && (
      
    <div className="userWrapper">
      <Title titleName="Users" />
      <DataGrid
        sx={{ p: 1 }}
        disableColumnMenu
        disableSelectionOnClick
        headerHeight={60}
        density="standard"
        rows={userData}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[8, 16, 24]}
        getRowId={(row) => row.id}
        components={{ Toolbar: QuickSearchToolbar }}
        autoHeight={true}
      />

      <DialogModal modelOps={model} setModelOps={setModel}>
        <UsersOperations
          model={model}
          initialValues={initialValues}
          setModel={setModel}
          setSelectedUserData={setSelectedUserData}
          getAllUsersData={getAllUsersData}
          technologyData={technologyData}
          designationData={designationData}
        ></UsersOperations>
      </DialogModal>

      <ToastContainer autoClose={2000} closeOnClick />
    </div>
    
    )}
    </>
  );
};

export default Users;
