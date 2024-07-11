import React from "react";
import Title from "../../common/Title/TItle";
import { Box, Button, Container, Grid } from "@mui/material";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SaveIcon from "@mui/icons-material/Save";
import TextInput from "../../common/Controls/TextInput";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { ChangePasswordModel } from "../../models/ChangePasswordModel";
import { changedPassword } from "../../services/UserService";
import * as yup from "yup";
import { getSecureLocalStorage } from "../../helpers/SecureLocalStorage";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const initialValues = {
    id: 0,
    password: "",
    oldPassword: "",
    confirmPassword: "",
  };

  const validationSchema = yup.object().shape({
    oldPassword: yup.string().required("OldPassword is required"),
    password: yup
      .string()
      .min(8)
      .max(16)
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });
  const onFormSubmit = async (values: ChangePasswordModel) => {
    values.id = parseInt(getSecureLocalStorage("userId") || "");
    let res = await changedPassword(values);
    if (res.success) {
      toast.success(res.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else toast.error("Something went wrong!!!");
  };

  return (
    <div className="profileWrapper">
      <Title titleName="Profile" />
      <div style={{ width: "100%" }}>
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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onFormSubmit}
              enableReinitialize
            >
              <Form id="feedbackform">
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <TextInput
                      label="Current Password"
                      name="oldPassword"
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput
                      label="New Password"
                      name="password"
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ mb: 2 }} spacing={1}>
                  <Grid item xs={9.6}></Grid>

                  <Grid item xs={2}>
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
            </Formik>
          </Box>
          <ToastContainer autoClose={2000} closeOnClick />
        </Container>
      </div>
    </div>
  );
};

export default Profile;
