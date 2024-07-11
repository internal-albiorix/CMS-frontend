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

function InquiriesDetail(props: any) {
  const { model, setModel, inquiriesDetailData } = props;
  const handleModelClose = () => {
    setModel({ open: false, ops: "" });
  };
  const GetTechnologyName = (params: technologyDataModel[]) => {
    return params.map((tech: any) => tech.technology.technologyName).join(", ");
  };
  return (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Inquiries {model.ops}
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
            Full Name: {inquiriesDetailData.fullName}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Email : {inquiriesDetailData.email}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Mobile : {inquiriesDetailData.mobileNumber}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Technology :{" "}
            {GetTechnologyName(inquiriesDetailData.inquiriesTechnologies)}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Experience : {inquiriesDetailData.experience}
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

export default InquiriesDetail;
