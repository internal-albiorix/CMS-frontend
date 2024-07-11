import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import MultiSelectDropdown from "../../common/Controls/MultiSelectDropdown";
import UploadFile from "../../common/Controls/UploadFile";
import TextInput from "../../common/Controls/TextInput";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { addEditReferEmployee } from "../../services/ReferEmployeeService";
import { getAllTechnology } from "../../services/TechnologyService";
import { DropdownModel } from "../../models/DropdownModel";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditReferEmployee = (props: any) => {
  useEffect(() => {
    getTechnologyData();
  }, []);
  const { editOpen, setEditOpen, selectedEmp, getReferEmployeeData } = props;

  const handleClose = () => {
    setEditOpen(false);
  };
  const [technologyData, setTechnologyData] = useState<DropdownModel[]>([]);

  const [fileName, setFileName] = useState("");
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

  const initialValues = {
    fullName: "",
    email: "",
    mobileNumber: "",
    candidateFullName: "",
    candidateEmail: "",
    candidateMobileNumber: "",
    technologyIds: [],
    candidateExperience: "",
    resume: "",
  };

  const validationSchema = yup.object().shape({
    fullName: yup.string().max(30).required("Your name required"),
    email: yup.string().email().required("Your Email required"),
    mobileNumber: yup
      .string()
      .matches(/^[0-9]+$/, "Invalid value")
      .length(10, "Invalid value")
      .required("Your mobile required"),
    candidateFullName: yup.string().max(30).required("Candidate name required"),
    candidateEmail: yup.string().email().required("Candidate mail required"),
    candidateMobileNumber: yup
      .string()
      .matches(/^[0-9]+$/, "Invalid value")
      .length(10, "Invalid value")
      .required("Employee mobile required"),
    technologyIds: yup.array().min(1).required("Minimum 1 technology required"),
    candidateExperience: yup.string().required("Candidate experience required"),
    // resume: yup.mixed().notRequired()
    // .required('Candidate resume is required')
  });

  const onFormSubmit = async (values: any) => {
    let formData = new FormData();
    formData.append("Id", selectedEmp.id);
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("mobileNumber", values.mobileNumber);
    formData.append("candidateFullName", values.candidateFullName);
    formData.append("candidateEmail", values.candidateEmail);
    formData.append("candidateMobileNumber", values.candidateMobileNumber);
    values.technologyIds.forEach((techId: string) =>
      formData.append("technologyIds[]", techId)
    );
    formData.append("candidateExperience", values.candidateExperience);
    formData.append("resumeFile", values.resumeFile);
    formData.append("resume", values?.resumeFile?.name);
    const res = await addEditReferEmployee(formData);
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
    setEditOpen(false);
  };
  return (
    <>
      <Dialog onClose={handleClose} open={editOpen} fullWidth>
        <Formik
          initialValues={selectedEmp || initialValues}
          validationSchema={validationSchema}
          onSubmit={onFormSubmit}
          enableReinitialize
        >
          {({ setFieldValue }) => (
            <Form id="editReferEmployee">
              <DialogTitle sx={{ m: 0, p: 2 }}>
                Edit Employee
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
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextInput label="Your Full Name" name="fullName" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextInput label="Your Email" name="email" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextInput
                      label="Your Mobile"
                      name="mobileNumber"
                      type="number"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextInput
                      label="Candidate Full Name"
                      name="candidateFullName"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextInput label="Candidate Email" name="candidateEmail" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextInput
                      label="Candidate Mobile"
                      name="candidateMobileNumber"
                      type="number"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MultiSelectDropdown
                      items={technologyData}
                      label="Technology"
                      name="technologyIds"
                    ></MultiSelectDropdown>
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput
                      label="Candidate Experience"
                      name="candidateExperience"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <UploadFile
                      name="resume"
                      setFieldValue={setFieldValue}
                      setFileName={setFileName}
                      fileName={fileName}
                    ></UploadFile>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<SaveIcon />}
                  type="submit"
                >
                  Save
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
      <ToastContainer autoClose={2000} closeOnClick />
    </>
  );
};

export default EditReferEmployee;
