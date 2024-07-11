import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import TextInput from "../../common/Controls/TextInput";
import MultiSelectDropdown from "../../common/Controls/MultiSelectDropdown";
import * as yup from "yup";
import {
  Button,
  IconButton,
  Grid,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteCandidate,
  insertUpdateCandidate,
} from "../../services/CandidateService";
import { candidateDataModel } from "../../models/CandidateModel";
import SelectDropdown from "./../../common/Controls/SelectDropdown";
import UploadFile from "../../common/Controls/UploadFile";

function CandidateOperations(props: any) {
  debugger;
  const {
    model,
    initialValues,
    setModel,
    setSelectedcandidateData,
    getcandidateData,
    technologyData,
    statusData,
  } = props;
  const handleModelClose = () => {
    setModel({ open: false, ops: "" });
    setSelectedcandidateData({
      id: 0,
      fullName: "",
      email: "",
      mobileNumber: "",
      technologyIds: [],
      experience: "",
      resumeFile: "",
    });
  };
  const [fileName, setFileName] = useState("");
  const validationSchema = yup.object().shape({
    mobileNumber: yup.string().max(30).required("Mobile number name required"),
    email: yup.string().max(40).required("Email required"),
    fullName: yup.string().max(30).required("Candidate name required"),
    technologyIds: yup.array().min(1).required("Minimum 1 technology required"),
    experience: yup.string().max(30).required("Candidate experience required"),
    resumeFile: yup.mixed().required("Resume is Required"),
  });

  const onFormSubmit = async (values: any) => {
    let res;
    if (model.ops === "Save" || model.ops === "Update") {
      let formData = new FormData();
      formData.append("id", initialValues.id);
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("mobileNumber", values.mobileNumber);
      formData.append("statusId", values.statusId);
      values.technologyIds.forEach((techId: string) =>
        formData.append("technologyIds[]", techId)
      );
      formData.append("experience", values.experience);
      formData.append("resumeFile", values.resumeFile);
      formData.append("resume", values?.resumeFile?.name);
      res = await insertUpdateCandidate(formData);
    } else {
      res = await deleteCandidate(values.id);
    }

    if (res.success) {
      await getcandidateData();
      handleModelClose();
      toast.success(res.message);
    } else toast.error("Something went wrong!!!");
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onFormSubmit}
      enableReinitialize
    >
      {({ setFieldValue }) => (
        <Form id={`${model.ops}candidate`}>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {model.ops} Candidate
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
            {model.ops !== "Delete" ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextInput label="Full Name" name="fullName" />
                </Grid>
                <Grid item xs={12}>
                  <TextInput label="Email" name="email" />
                </Grid>
                <Grid item xs={12}>
                  <TextInput label="Mobile number" name="mobileNumber" />
                </Grid>
                <Grid item xs={12}>
                  <MultiSelectDropdown
                    items={technologyData}
                    label="Technology"
                    name="technologyIds"
                    valueField="value"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput label="Experience" name="experience" />
                </Grid>

                {model.ops === "Update" ? (
                  <Grid item xs={12}>
                    <SelectDropdown
                      items={statusData}
                      label="Status"
                      name="statusId"
                      valueField="value"
                    />
                  </Grid>
                ) : (
                  ""
                )}
                <Grid item xs={12}>
                  <UploadFile
                    name="resumeFile"
                    setFieldValue={setFieldValue}
                    setFileName={setFileName}
                    fileName={fileName}
                  ></UploadFile>
                </Grid>
              </Grid>
            ) : (
              <Typography gutterBottom>
                Are you sure want to delete this record?
              </Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="inherit"
              onClick={handleModelClose}
            >
              {" "}
              Cancel{" "}
            </Button>
            {model.ops !== "Delete" ? (
              <Button
                variant="contained"
                color="error"
                startIcon={<SaveIcon />}
                type="submit"
              >
                {model.ops}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                type="submit"
              >
                {model.ops}
              </Button>
            )}
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
}

export default CandidateOperations;
