import React, { useState, useEffect } from "react";
import { Grid, Container, Box, Button } from "@mui/material";
import TextInput from "../../common/Controls/TextInput";
import MultiSelectDropdown from "../../common/Controls/MultiSelectDropdown";
import UploadFile from "../../common/Controls/UploadFile";
import SaveIcon from "@mui/icons-material/Save";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { addEditReferEmployee } from "../../services/ReferEmployeeService";
import { getAllTechnology } from "../../services/TechnologyService";
import { DropdownModel } from "../../models/DropdownModel";
import { referEmployeeModel } from "../../models/ReferEmployeeModel";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import ErrorMessage from '../../common/Controls/ErrorMessage';
import "react-toastify/dist/ReactToastify.css";

const AddReferEmployee = (props: any) => {
  useEffect(() => {
    document.title = "Add Refer Employee";
    getTechnologyData();
  }, []);

  const [fileName, setFileName] = useState("");

  const [referEmployeeData] = useState<referEmployeeModel>({
    id: 0,
    fullName: "",
    email: "",
    mobileNumber: "",
    candidateFullName: "",
    candidateEmail: "",
    candidateMobileNumber: "",
    technologyIds: [],
    candidateExperience: "",
    resumeFile: "",
  });
  const [technologyData, setTechnologyData] = useState<DropdownModel[]>([]);
  const onFormSubmit = async (values: any, helpers: any) => {
    let formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("email", values.email);
    formData.append("mobileNumber", values.mobileNumber);
    formData.append("candidateFullName", values.candidateFullName);
    formData.append("candidateEmail", values.candidateEmail);
    formData.append("candidateMobileNumber", values.candidateMobileNumber);
        // formData.append("technologyIds", values.technologyIds);
    values.technologyIds.forEach((techId: string) =>
      formData.append("technologyIds[]", techId)
    );
    formData.append("candidateExperience", values.candidateExperience);
    formData.append("resumeFile", values.resumeFile);
    const res = await addEditReferEmployee(formData);

    if (res.success) {
      setFileName("");
      helpers.resetForm({
        id: 0,
        fullName: "",
        email: "",
        mobileNumber: "",
        candidateFullName: "",
        candidateEmail: "",
        candidateMobileNumber: "",
        technologyIds: [],
        candidateExperience: 0,
        resumeFile: "",
      });
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const validationSchema = yup.object().shape({
    fullName: yup.string().max(30).required("Your name is required"),
    email: yup.string().email().required("Your email is required"),
    mobileNumber: yup
          .string()
          .required("Mobile number required")
          .matches(/^[0-9]+$/, "Invalid Mobile Number"),
    candidateMobileNumber: yup
      .string()
      .matches(/^[0-9]+$/, "Invalid Mobile No.")
      .length(10, "Invalid Mobile No.")
      .required("Mobile No. is required"),
    candidateEmail: yup.string().email().required("Candidate email is required"),
    candidateFullName: yup.string().max(30).required("Candidate name is required"),
    technologyIds: yup.array().min(1, "Minimum 1 technology is required").required("At least one technology is required"),
    candidateExperience: yup.string().required("Candidate experience is required"),
    resumeFile: yup.mixed().required("Resume is required"),
  });

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

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ position: "relative", top: "4%" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 24px",
          border: "1px solid #d4cfcf",
          boxShadow: "0px 5px 8px 2px rgb(206 204 204)",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ margin: "16px 0" }}>
          <strong>Fill Form</strong>
        </h2>

        <Formik
          initialValues={referEmployeeData}
          validationSchema={validationSchema}
          onSubmit={onFormSubmit}
          enableReinitialize
        >
          {({ setFieldValue, resetForm, touched, errors }) => {
            return (
              <Form id="addReferEmployee">
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <TextInput label="Your Full Name" name="fullName" />
                    <ErrorMessage touched={touched.fullName} errors={errors.fullName} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextInput label="Your Email" name="email" />
                    <ErrorMessage touched={touched.email} errors={errors.email} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextInput label="Your Mobile" name="mobileNumber" />
                    <ErrorMessage touched={touched.mobileNumber} errors={errors.mobileNumber} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextInput label="Candidate Full Name" name="candidateFullName" />
                    <ErrorMessage touched={touched.candidateFullName} errors={errors.candidateFullName} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextInput label="Candidate Email" name="candidateEmail" />
                    <ErrorMessage touched={touched.candidateEmail} errors={errors.candidateEmail} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextInput label="Candidate Mobile" name="candidateMobileNumber" />
                    <ErrorMessage touched={touched.candidateMobileNumber} errors={errors.candidateMobileNumber} />
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
                    <TextInput label="Candidate Experience" name="candidateExperience" />
                    <ErrorMessage touched={touched.candidateExperience} errors={errors.candidateExperience} />
                  </Grid>
                  <Grid item xs={12}>
                    <UploadFile
                      name="resumeFile"
                      setFieldValue={setFieldValue}
                      setFileName={setFileName}
                      fileName={fileName}
                    />
                    <ErrorMessage touched={touched.resumeFile} errors={errors.resumeFile} />
                  </Grid>
                </Grid>

                <Grid container sx={{ mb: 2 }} spacing={1}>
                  <Grid item xs={3}></Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      color="inherit"
                      onClick={() => resetForm()}
                    >
                      Reset
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<SaveIcon />}
                      type="submit"
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item xs={3}></Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>

      </Box>
      <ToastContainer autoClose={2000} closeOnClick />
    </Container>
  );
};

export default AddReferEmployee;
