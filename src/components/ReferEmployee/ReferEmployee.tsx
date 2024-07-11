import React, { useEffect, useState } from "react";
import Title from "../../common/Title/TItle";
import { IconButton, Box, Button } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import EditReferEmployee from "./EditReferEmployee";
import DeleteReferEmployee from "./DeleteReferEmployee";
import { referEmployeeModel } from "../../models/ReferEmployeeModel";
import { getReferEmployeeTableData } from "../../services/ReferEmployeeService";
import { NavLink as RouterLink } from "react-router-dom";
import FileDownload from "../../common/Controls/DownloadFile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReferEmployee: React.FC = () => {
  const [referEmployee, setReferEmployee] = useState<referEmployeeModel[]>([]);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [selectedEmpData, setSelectedEmpData] = useState({});

  useEffect(() => {
    getReferEmployeeData();
  }, []);

  const getReferEmployeeData = async () => {
    let res = await getReferEmployeeTableData();
    setReferEmployee(res.data);
  };

  const handleClickEditOpen = (params: any) => {
    let objData = referEmployee.filter((item) => item.id === params.row.id)[0];
    setSelectedEmpData(objData);
    setEditOpen(true);
  };

  const handleClickDeleteOpen = (params: any) => {
    setSelectedEmpData(params.row);
    setDeleteOpen(true);
  };

  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Employee Name",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "candidateFullName",
      headerName: "Candidate Name",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "candidateEmail",
      headerName: "Candidate Email",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "candidateMobileNumber",
      headerName: "Candidate Mobile",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "technology",
      headerName: "Technology",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
      minWidth: 300,
      renderCell(params) {
        const technologyDataModel = params.row.technologyModel.map(
          (techName: any) => techName.technologyName
        );
        return technologyDataModel.join(", ");
      },
    },
    {
      field: "resume",
      headerName: "Resume",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <FileDownload fileName={params.row.resume}></FileDownload>
          </>
        );
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
      renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => handleClickEditOpen(params)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleClickDeleteOpen(params)}>
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  const QuickSearchToolbar = () => {
    return (
      <Box sx={{ height: "45px" }}>
        <GridToolbarQuickFilter
          className="muiGridSearch"
          sx={{ float: "right", width: "50%" }}
        />

        <Button
          component={RouterLink}
          to="/add-refer-employee"
          target="_blank"
          color="error"
        >
          <span>
            <i>
              <strong>Click Here To Refer Employee</strong>
            </i>
          </span>
        </Button>
      </Box>
    );
  };

  return (
    <div className="referEmployeeWrapper">
      <Title titleName="Refer Employee" />

      <div style={{ width: "100%" }}>
        <DataGrid
          sx={{ p: 1 }}
          disableColumnMenu
          disableSelectionOnClick
          headerHeight={60}
          density="standard"
          rows={referEmployee}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 15]}
          getRowId={(row) => row.id}
          components={{ Toolbar: QuickSearchToolbar }}
          autoHeight={true}
        />
      </div>

      <EditReferEmployee
        getReferEmployeeData={getReferEmployeeData}
        setEditOpen={setEditOpen}
        editOpen={editOpen}
        selectedEmp={selectedEmpData}
      />
      <DeleteReferEmployee
        getReferEmployeeData={getReferEmployeeData}
        setDeleteOpen={setDeleteOpen}
        deleteOpen={deleteOpen}
        selectedEmp={selectedEmpData}
      />
      <ToastContainer autoClose={2000} closeOnClick />
    </div>
  );
};

export default ReferEmployee;
