import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Button, Link } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Edit from "@mui/icons-material/Edit";
import Add from "@mui/icons-material/Add";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Title from "../../common/Title/TItle";
import { getAllCandidate, rejectInterviewSchedule } from "../../services/CandidateService";
import { candidateDataModel } from "../../models/CandidateModel";
import { ToastContainer, toast } from "react-toastify";
import CandidateOperations from "./CandidateOperations";
import DialogModal from "../../common/Controls/Dialog";
import "react-toastify/dist/ReactToastify.css";
import { getAllTechnology } from "../../services/TechnologyService";
import { getAllStatus } from "../../services/StatusService";
import { DropdownModel } from "../../models/DropdownModel";
import { getSecureLocalStorage } from "../../helpers/SecureLocalStorage";
import CandidateDetail from "./CandidateDetail";
import CommentIcon from "@mui/icons-material/Comment";
import MenuActions from "./MenuActions";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import FeedbackIcon from "@mui/icons-material/Feedback";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";
import FeedBacksView from "./FeedBacksView";
import TimeLine from "./TimeLine";
import FileDownload from "./../../common/Controls/DownloadFile";
import Loader from "../../helpers/Loader";
import { Toast } from "react-toastify/dist/components";

const Candidate: React.FC = () => {
  const roles = getSecureLocalStorage("role");
  const [loading, setLoading] = useState(false);
  const [candidateDataList, setCandidateDataList] = useState<
    candidateDataModel[]
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
  const [commentsmodel, setcommentsModel] = useState<{
    open: boolean;
    ops: string;
  }>({
    open: false,
    ops: "",
  });
  const [feedBacksmodel, setfeedBacksModel] = useState<{
    open: boolean;
    ops: string;
  }>({
    open: false,
    ops: "",
  });

  const [timelinemodel, settimelineModel] = useState<{
    open: boolean;
    ops: string;
  }>({
    open: false,
    ops: "",
  });
  const [technologyData, setTechnologyData] = useState<DropdownModel[]>([]);
  const [statusData, setStatusData] = useState<DropdownModel[]>([]);
  const [detailCandidateData, setdetailCandidateData] =
    useState<candidateDataModel>();
  const [candidateData, setCandidateData] = useState<candidateDataModel>({
    id: 0,
    mobileNumber: "",
    email: "",
    fullName: "",
    technologyIds: [],
    experience: "",
    statusId: "",
    resumeFile: "",
  });
  const initialValues = {
    id: candidateData.id || 0,
    fullName: candidateData.fullName || "",
    email: candidateData.email || "",
    mobileNumber: candidateData.mobileNumber || "",
    technologyIds: candidateData.technologyIds || [],
    experience: candidateData.experience || "",
    statusId: candidateData.statusId || 0,
    resumeFile: candidateData.resume || "",
  };
  useEffect(() => {
    getAllCandidateData();
    getTechnologyData();
    getStatusData();
  }, []);

  const getAllCandidateData = async () => {
    setLoading(true);
    const { data, success } = await getAllCandidate();

    if (success) {
      setCandidateDataList(data);
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
  const getStatusData = async () => {
    const { data, success } = await getAllStatus("Status/GetAllStatus");
    if (success) {
      let statusData = data
        .filter(
          (x: any) => x.statusName !== "New" && x.statusName !== "In Progress"
        )
        .map((data: any) => {
          return {
            key: data.id,
            value: data.statusName,
            text: data.statusName,
          };
        });
      setStatusData(statusData);
    }
  };
  const handleClickEditOpen = (rowData: candidateDataModel) => {
    setCandidateData(rowData);
    setModel({ open: true, ops: "Update" });
  };
  const handleClickDetailOpen = (rowData: candidateDataModel) => {
    setdetailCandidateData(rowData);
    setDetailModel({ open: true, ops: "Detail" });
  };
  const navigate = useNavigate();
  const handleClickFeedbackForm = (rowData: candidateDataModel) => {
    navigate("/feedbackForm", {
      state: { model: rowData },
    });
  };

  const handleClickCommentsOpen = (rowData: candidateDataModel) => {
    setdetailCandidateData(rowData);
    setcommentsModel({ open: true, ops: "Comments" });
  };
  const handleClickFeedBackOpen = (rowData: candidateDataModel) => {
    setdetailCandidateData(rowData);
    setfeedBacksModel({ open: true, ops: "FeedBacks" });
  };
  const handleClickDeleteOpen = (rowData: candidateDataModel) => {
    setCandidateData(rowData);
    setModel({ open: true, ops: "Delete" });
  };
  const handleClickInsertOpen = () => {
    setModel({ open: true, ops: "Save" });
  };

  const openCandidateTimeLine = (rowData: candidateDataModel) => {
    setdetailCandidateData(rowData);
    settimelineModel({ open: true, ops: "TimeLine" });
  };
  const handleClickRejectInterviewSchedule = async(rowData:candidateDataModel)=>{
    let res = await rejectInterviewSchedule(
      rowData.id
    );
    if (res) {
     toast.success(res.message)
    } 
  };
  const allcolumns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Name",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
      minWidth: 200,
      renderCell: (params: any) => {
        return roles != null && (roles === "2" || roles === "1") ? (
          <Link
            component="button"
            variant="body2"
            onClick={() => openCandidateTimeLine(params.row)}
          >
            {params.row.fullName}
          </Link>
        ) : (
          params.row.fullName
        );
      },
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
      field: "status",
      headerName: "Status",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
      minWidth: 100,
      renderCell(params) {
        return params.row.statusModel.statusName;
      },
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
      minWidth: 250,
      renderCell: (params) => {
        return (
          <>
            <MenuActions>
              <MenuItem onClick={() => handleClickDetailOpen(params.row)}>
                <ListItemIcon>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                  Details
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => handleClickFeedbackForm(params.row)}>
                <ListItemIcon>
                  <FeedbackIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit" noWrap>
                  FeedBack Form
                </Typography>
              </MenuItem>
              {roles != null && (roles === "2" || roles === "1") ? (
                <div>
                  <MenuItem onClick={() => handleClickEditOpen(params.row)}>
                    <ListItemIcon>
                      <Edit fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                      Edit
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleClickDeleteOpen(params.row)}>
                    <ListItemIcon>
                      <Delete fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                      Delete
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleClickCommentsOpen(params.row)}>
                    <ListItemIcon>
                      <CommentIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                      Comments
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleClickFeedBackOpen(params.row)}>
                    <ListItemIcon>
                      <VisibilityIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                      Show FeedBack
                    </Typography>
                  </MenuItem>
                </div>
              ) : (
                <div>
                  <MenuItem onClick={() => handleClickRejectInterviewSchedule(params.row)}>
                    <ListItemIcon>
                      <CancelIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                      Reject
                    </Typography>
                  </MenuItem>
                </div>
              )}
            </MenuActions>
          </>
        );
      },
    },
  ];
  const interviewerColumn : GridColDef = {
    field: "interviewerName",
    headerName: "Interviewer",
    headerClassName: "dataGridHeader",
    flex: 1,
    align: "left",
    headerAlign: "left",
    minWidth: 200,
    renderCell: (params:any) => {
      if (!params.row.interviewerName) {
        return "Not Scheduled";
      }
  
      const isReject = params.row.isReject;
      const interviewerStyle = {
        color: isReject ? 'red' : 'green',
      };
  
      return (
        <span style={interviewerStyle}>
          {params.row.interviewerName}
        </span>
      );
    },
  };

  const columns = [...allcolumns];
  if (roles === "1" || roles === "2") {
    columns.splice(1, 0, interviewerColumn);
  }
  const [pageSize, setPageSize] = React.useState(5);
  return (
    <>
      {loading && <Loader />} {/* Display loader when loading */}
      {!loading && (
        <>
          <Title titleName="Candidate" />
          <div style={{ width: "100%" }}>
            <DataGrid
              sx={{ p: 1 }}
              disableColumnMenu
              disableSelectionOnClick
              headerHeight={60}
              density="standard"
              rows={candidateDataList}
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
            <CandidateOperations
              model={model}
              initialValues={initialValues}
              setModel={setModel}
              setSelectedcandidateData={setCandidateData}
              getcandidateData={getAllCandidateData}
              technologyData={technologyData}
              statusData={statusData}
            />
          </DialogModal>

          <DialogModal modelOps={detailmodel} setModelOps={setDetailModel}>
            <CandidateDetail
              model={detailmodel}
              setModel={setDetailModel}
              candidateDetailData={detailCandidateData}
            />
          </DialogModal>
          <DialogModal
            modelOps={commentsmodel}
            setModelOps={setcommentsModel}
            maxwithValue="lg"
          >
            <Comments
              model={commentsmodel}
              setModel={setcommentsModel}
              candidateDetailData={detailCandidateData}
            />
          </DialogModal>
          <DialogModal
            modelOps={feedBacksmodel}
            setModelOps={setfeedBacksModel}
            maxwithValue="lg"
          >
            <FeedBacksView
              model={feedBacksmodel}
              setModel={setfeedBacksModel}
              candidateDetailData={detailCandidateData}
            />
          </DialogModal>

          <DialogModal
            modelOps={timelinemodel}
            setModelOps={settimelineModel}
            maxwithValue="lg"
          >
            <TimeLine
              model={timelinemodel}
              setModel={settimelineModel}
              candidateDetailData={detailCandidateData}
            />
          </DialogModal>
        </>
      )}
      <ToastContainer autoClose={2000} closeOnClick />
    </>
  );
};
export default Candidate;
