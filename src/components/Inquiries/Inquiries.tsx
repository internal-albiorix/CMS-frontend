import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";

import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Title from "../../common/Title/TItle";
import { ToastContainer } from "react-toastify";
import { getSecureLocalStorage } from "../../helpers/SecureLocalStorage";
import { inquiriesDataModel } from "../../models/InquiriesModel";
import InquiriesOperations from "./InquiriesOperation";
import { getAllInquiries } from "../../services/InquiriesService";
import { getAllTechnology } from "../../services/TechnologyService";
import { DropdownModel } from "../../models/DropdownModel";
import { Add, Delete, Edit, Transform,Compare,SwapHoriz  } from "@mui/icons-material";
import FileDownload from "../../common/Controls/DownloadFile";
import Loader from "../../helpers/Loader";
import DialogModal from "../../common/Controls/Dialog";
import InquiriesDetail from "./InquiriesDetail";


const Inquiries: React.FC = () => {
  const roles = getSecureLocalStorage("role");
  const [loading, setLoading] = useState(false);
  const [inquiriesDataList, setInquiriesDataList] = useState<
    inquiriesDataModel[]
  >([]);
  const [model, setModel] = useState<{ open: boolean; ops: string }>({
    open: false,
    ops: "",
  });
  const [detailmodel, setDetailModel] = useState<{
    open: boolean;
    ops: string;
  }>({
    open: false,
    ops: "",
  });
  
  const [technologyData, setTechnologyData] = useState<DropdownModel[]>([]);
  const [detailInquiriesData, setdetailInquiriesData] =
    useState<inquiriesDataModel>();
  const [inquiriesData, setInquiriesData] = useState<inquiriesDataModel>({
    id: 0,
    mobileNumber: "",
    email: "",
    fullName: "",
    technologyIds: [],
    experience: "",
    resumeFile: "",
  });
  const initialValues = {
    id: inquiriesData.id || 0,
    fullName: inquiriesData.fullName || "",
    email: inquiriesData.email || "",
    mobileNumber: inquiriesData.mobileNumber || "",
    technologyIds: inquiriesData.inquiriesTechnologies?.map(item => item.technologyId) || [],
    experience: inquiriesData.experience || "",
    resumeFile: inquiriesData.resume || "",
  };
  useEffect(() => {
    getAllInquiriesData();
    getTechnologyData();

  }, []);

  const getAllInquiriesData = async () => {
    setLoading(true);
    const { data, success } = await getAllInquiries();

    if (success) {
      setInquiriesDataList(data);
    }
    setLoading(false);
  };
  function QuickSearchToolbar() {
    return (
      <>
        <GridToolbarQuickFilter
          className="muiGridSearch"
          sx={{ float: "left", width: "50%" }}
        />
        {roles !== "3" ? (
          <Box
            sx={{
              height: "45px",
            }}
          >
            <Button
              sx={{ float: "right" }}
              variant="contained"
              color="error"
              onClick={handleClickInsertOpen}
              startIcon={<Add />}
            >
              Add new
            </Button>
          </Box>
        ) : null}
      </>
    );
  }
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

  const handleClickEditOpen = (rowData: inquiriesDataModel) => {
    setInquiriesData(rowData);
    setModel({ open: true, ops: "Update" });
  };

  const handleClickDetailOpen = (rowData: inquiriesDataModel) => {
    setdetailInquiriesData(rowData);
    setDetailModel({ open: true, ops: "Detail" });
  };
  const handleClickDeleteOpen = (rowData: inquiriesDataModel) => {
    setInquiriesData(rowData);
    setModel({ open: true, ops: "Delete" });
  };
  const handleClickConvertCandidateOpen = (rowData: inquiriesDataModel) => {
    setInquiriesData(rowData);
    setModel({ open: true, ops: "Convert Candidate" });
  };
  const handleClickInsertOpen = () => {
    setModel({ open: true, ops: "Save" });
  };

  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Name",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
      minWidth: 250,
    },
    {
      field: "mobileNumber",
      headerName: "Contact No",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
      minWidth: 150,
    },
    {
      field: "technology",
      headerName: "Technology",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
      minWidth: 200,
      renderCell(params) {
        const technologyDataModel = params.row.inquiriesTechnologies.map(
          (techName: any) => techName.technology.technologyName
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
      minWidth: 250,
      renderCell: (params) => {
        return (
          <>
            {roles != null && (roles === "2" || roles === "1") && (
              <>
                <Tooltip title="Convert to Candidate">
                  <IconButton
                    color="primary"
                    onClick={() => handleClickConvertCandidateOpen(params.row)}
                  >
                    <SwapHoriz sx={{ color: 'grey' }} />
                  </IconButton>
                </Tooltip>
                <IconButton onClick={() => handleClickEditOpen(params.row)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleClickDeleteOpen(params.row)}>
                  <Delete />
                </IconButton>
              </>
            )}
          </>
        );
      },
    },
  ];
  const [pageSize, setPageSize] = React.useState(10);
  return (
    <>
      {loading && <Loader />} {/* Display loader when loading */}
      {!loading && (
        <>
          <Title titleName="Inquiries" />
          <div style={{ width: "100%" }}>
            <DataGrid
              sx={{ p: 1 }}
              disableColumnMenu
              disableSelectionOnClick
              headerHeight={60}
              density="standard"
              rows={inquiriesDataList}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 15]}
              getRowId={(row) => row.id}
              components={{ Toolbar: QuickSearchToolbar }}
              autoHeight={true}
            />
          </div>
          <DialogModal modelOps={model} setModelOps={setModel}>
            <InquiriesOperations
              model={model}
              initialValues={initialValues}
              setModel={setModel}
              setSelectedinquiriesData={setInquiriesData}
              getinquiriesData={getAllInquiriesData}
              technologyData={technologyData}

            />
          </DialogModal>

          {/* <DialogModal modelOps={detailmodel} setModelOps={setDetailModel}>
            <InquiriesDetail
              model={detailmodel}
              setModel={setDetailModel}
              inquiriesDetailData={detailInquiriesData}
            />
          </DialogModal> */}
        </>
      )}
      <ToastContainer autoClose={2000} closeOnClick />
    </>
  );
}

export default Inquiries;