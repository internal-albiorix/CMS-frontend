import CloseIcon from "@mui/icons-material/Close";
import { technologyDataModel } from "./../../models/TechnologyModel";
import {
  Button,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";

function CandidateDetail(props: any) {
  const { model, setModel, candidateDetailData } = props;
  const handleModelClose = () => {
    setModel({ open: false, ops: "" });
  };
  const GetTechnologyName = (params: technologyDataModel[]) => {
    return params.map((tech: any) => tech.technologyName).join(", ");
  };
  return (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Candidate {model.ops}
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
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Full Name: {candidateDetailData.fullName}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Email : {candidateDetailData.email}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Mobile : {candidateDetailData.mobileNumber}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Technology :{" "}
            {GetTechnologyName(candidateDetailData.technologyModel)}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Experience : {candidateDetailData.experience}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Status : {candidateDetailData.statusModel.statusName}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="inherit" onClick={handleModelClose}>
          {" "}
          Close{" "}
        </Button>
      </DialogActions>
    </>
  );
}

export default CandidateDetail;
