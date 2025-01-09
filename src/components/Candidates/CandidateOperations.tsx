import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import TextInput from "../../common/Controls/TextInput";
import MultiSelectDropdown from "../../common/Controls/MultiSelectDropdown";
import ErrorMessage from "../../common/Controls/ErrorMessage";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  Button,
  IconButton,
  Grid,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  deleteCandidate,
  insertUpdateCandidate,
} from "../../services/CandidateService";
import SelectDropdown from "./../../common/Controls/SelectDropdown";
import UploadFile from "../../common/Controls/UploadFile";

function CandidateOperations(props: any) {
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
      resumeFile: ""
    });
  };
  const [fileName, setFileName] = useState("");
  const validationSchema = yup.object().shape({
    mobileNumber: yup
      .string()
      .required("Mobile number required")
      .matches(/^[0-9]+$/, "Invalid Mobile Number"),
    email: yup.string().max(40).required("Email required"),
    fullName: yup.string().max(30).required("Candidate name required"),
    technologyIds: yup.array().min(1, "Minimum 1 technology required"),
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
    } else toast.error(res.message);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onFormSubmit}
      enableReinitialize
    >
      {({ setFieldValue, touched, errors }) => (
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
                  <ErrorMessage touched={touched.fullName} errors={errors.fullName} />
                </Grid>
                <Grid item xs={12}>
                  <TextInput label="Email" name="email" />
                  <ErrorMessage touched={touched.email} errors={errors.email} />
                </Grid>
                <Grid item xs={12}>
                  <TextInput label="Mobile number" name="mobileNumber" />
                  <ErrorMessage touched={touched.mobileNumber} errors={errors.mobileNumber} />
                </Grid>
                <Grid item xs={12}>
                  <MultiSelectDropdown
                    items={technologyData}
                    label="Technology"
                    name="technologyIds"
                    valueField="value"
                  />
                  <ErrorMessage touched={touched.technologyIds} errors={errors.technologyIds} />
                </Grid>
                <Grid item xs={12}>
                  <TextInput label="Experience" name="experience" />
                  <ErrorMessage touched={touched.experience} errors={errors.experience} />
                </Grid>

                {model.ops === "Update" ? (
                  <Grid item xs={12}>
                    <SelectDropdown
                      items={statusData}
                      label="Status"
                      name="statusId"
                      valueField="value"
                    />
                    <ErrorMessage touched={touched.statusId} errors={errors.statusId} />
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
                  <ErrorMessage touched={touched.resumeFile} errors={errors.resumeFile} />
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
