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
  deleteInquiries,
  insertUpdateInquiries,
} from "../../services/InquiriesService";
import UploadFile from "../../common/Controls/UploadFile";
import { insertUpdateCandidate } from "../../services/CandidateService";
import ErrorMessage from "./../../common/Controls/ErrorMessage";


function InquiriesOperations(props: any) {
  const {
    model,
    initialValues,
    setModel,
    setSelectedinquiriesData,
    getinquiriesData,
    technologyData,

  } = props;
  const handleModelClose = () => {
    setModel({ open: false, ops: "" });
    setSelectedinquiriesData({
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
    mobileNumber: yup
          .string()
          .required("Mobile number required")
          .matches(/^[0-9]+$/, "Invalid Mobile Number"),
    email: yup.string().max(30).required("Email required"),
    fullName: yup.string().max(30).required("Name required"),
    technologyIds: yup.array().min(1, "Minimum 1 technology required").required("At least one technology is required"),
    experience: yup.string().max(30).required("Experience required"),
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
      values.technologyIds.forEach((techId: string) =>
        formData.append("technologyIds[]", techId)
      );
      formData.append("experience", values.experience);
      formData.append("resumeFile", values.resumeFile);
      formData.append("resume", values?.resumeFile?.name);
      res = await insertUpdateInquiries(formData);
    }
    else if (model.ops === "Convert Candidate") {
      let formData = new FormData();
      formData.append("id", "0");
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("mobileNumber", values.mobileNumber);
      formData.append("statusId", "0");
      values.technologyIds.forEach((techId: string) =>
        formData.append("technologyIds[]", techId)
      );
      formData.append("experience", values.experience);
      formData.append("resumeFile", "");
      formData.append("resume", values.resumeFile);
      res = await insertUpdateCandidate(formData);
    } else {
      res = await deleteInquiries(values.id);
    }
    if (res.success) {
      await getinquiriesData();
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
        <Form id={`${model.ops}inquiries`}>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {model.ops} Inquiries
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
            {model.ops === "Convert Candidate" ? (
              <Typography>
                Are you sure you want to convert this inquiry to a candidate?
              </Typography>
            ) :
              model.ops !== "Delete" ? (
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

export default InquiriesOperations;
