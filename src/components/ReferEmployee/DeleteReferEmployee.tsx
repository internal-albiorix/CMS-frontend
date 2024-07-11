import * as React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteReferEmployee } from "../../services/ReferEmployeeService";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteReferEmployee = (props: any) => {
  const { deleteOpen, setDeleteOpen, selectedEmp, getReferEmployeeData } =
    props;
  const handleClose = () => {
    setDeleteOpen(false);
  };

  const onDeleteEmployee = async () => {
    let res = await deleteReferEmployee(selectedEmp.id);
    if (res.success) {
      handleModelClose();
      await getReferEmployeeData();
      toast.success(res.message);
    } else {
      toast.error("Something went wrong!!!");
    }
    handleClose();
  };
  const handleModelClose = () => {
    setDeleteOpen(false);
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={deleteOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Delete Employee
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography gutterBottom>
            You want to delete{" "}
            <strong>Candidate - {selectedEmp.candidateFullName}?</strong>
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onDeleteEmployee}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer autoClose={2000} closeOnClick />
    </>
  );
};

export default DeleteReferEmployee;
