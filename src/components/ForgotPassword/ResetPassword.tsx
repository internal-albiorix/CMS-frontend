import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { NavLink as RouterLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { ResetPasswordModel } from "../../models/ChangePasswordModel";
import { ResetUserPassword } from "../../services/AuthenticationService";
import Loader from "../../helpers/Loader";
import TextInput from "../../common/Controls/TextInput";
import ErrorMessage from "../../common/Controls/ErrorMessage";


const ResetPassword: React.FC = ({ }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { token } = useParams<{ token: string | undefined }>();
  const tokenValue = token || "";
  const initialValues = {
    token: tokenValue,
    password: "",
    confirmPassword: "",
  };

  const onFormSubmit = async (values: ResetPasswordModel) => {
    values.token = tokenValue;
    setLoading(true);
    let res = await ResetUserPassword(values);
    setLoading(false);
    if (res.success) {
      toast.success(res.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else toast.error(res.message);
  };
  const validationSchema = yup.object().shape({

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

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ position: "relative", top: "10%" }}
    >
      <CssBaseline />
      {loading ? (
        <Loader /> // Display loader when loading
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "24px",
            border: "1px solid #d4cfcf",
            boxShadow: "0px 5px 8px 2px rgb(206 204 204)",
            borderRadius: "10px",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#DE4948" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onFormSubmit}
            enableReinitialize
          >
            {({ touched, errors }) => (
              <Form >
                <Box sx={{ mt: 1 }}>

                  <TextInput
                    margin="normal"
                    required
                    fullWidth
                    label="New Password"
                    name="password"
                    type="password"

                    autoComplete="new-password"
                  />
                  <ErrorMessage touched={touched.password} errors={errors.password} />
                  <TextInput
                    margin="normal"
                    required
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"

                    type="password"
                  />
                  <ErrorMessage touched={touched.confirmPassword} errors={errors.confirmPassword} />
                  <Button
                    component={RouterLink}
                    to="/Login"
                  >
                    <i>
                      <strong>Back to Login</strong>
                    </i>
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      backgroundColor: "#DE4948",
                      ":hover": { backgroundColor: "#DE4948" },
                    }}
                  >
                    Reset Password
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      )}
      <ToastContainer autoClose={2000} closeOnClick />
    </Container>
  );
};

export default ResetPassword;
