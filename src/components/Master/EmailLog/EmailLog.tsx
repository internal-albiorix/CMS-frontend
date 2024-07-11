import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Button, IconButton, Box, Badge } from "@mui/material";
import Title from "../../../common/Title/TItle";

import { getAllEmailLog } from "../../../services/EmailLogService";
import { EmailLogModel } from "../../../models/EmailLogModel";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const EmailLog: React.FC = () => {
  const [emailLogData, setEmailLogData] = useState<
  EmailLogModel[]
  >([]);
  
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    getEmailLogData();
  }, []);

  const getEmailLogData = async () => {
    const { data, success } = await getAllEmailLog();
    console.log(data);
    if (success) setEmailLogData(data);
  };

  const QuickSearchToolbar = () => {
    return (
      <Box sx={{ height: "45px" }}>
        <GridToolbarQuickFilter
          className="muiGridSearch"
          sx={{ float: "left", width: "50%" }}
        />
      </Box>
    );
  };

 

  const columns: GridColDef[] = [
    {
      field: "recipient",
      headerName: "Recipient",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "sentDate",
      headerName: "SentDate",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return moment(date).format('MMMM Do YYYY, h:mm:ss a');;
      },
    },
    {
        field: "status",
        headerName: "Status",
        headerClassName: "dataGridHeader",
        width:200,
        flex:0,
        renderCell: (params) => (
        <span
          style={{
            color: params.value === "Success" ? "green" : "red",
            fontWeight: "bold"
          }}
        >
          {params.value}
        </span>
      ),
      },
      {
        field: "errorMessage",
        headerName: "ErrorMessage",
        headerClassName: "dataGridHeader",
        flex: 1,
        align: "left",
        headerAlign: "left",
      },
    
  ];

  return (
    <div className="emaillogWrapper">
      <Title titleName="EmailLog" />
      <DataGrid
        sx={{ p: 1 }}
        disableColumnMenu
        disableSelectionOnClick
        headerHeight={60}
        density="standard"
        rows={emailLogData}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[8, 16, 24]}
        getRowId={(row) => row.id}
        components={{ Toolbar: QuickSearchToolbar }}
        autoHeight={true}
      />

      <ToastContainer autoClose={2000} closeOnClick />
    </div>
  );
};

export default EmailLog;
