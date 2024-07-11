import React, { useState } from "react";
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
import {  NavLink as RouterLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik } from "formik";
import { sentEmailForgotPassword } from "../../services/AuthenticationService";
import Loader from "../../helpers/Loader";
import * as yup from "yup";
import { Email } from "@mui/icons-material";
//import { ForgotPassword } from "../../services/AuthService";

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false); 
  const [email, setEmail] = useState("");


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
        setLoading(true);
        const forgetdata = {
                Email:email
                };
      let res = await sentEmailForgotPassword(forgetdata);
      setLoading(false);
      if (res?.statusCode === 200) 
            toast.success("Email sent successfully in your mail id");
      else
            toast.error(res.message)
  };
 

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
       
        <form onSubmit={handleSubmit}>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            type="email"
            name="email"
            required
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />
         
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
        </form>
       
        </Box>
      )}
      <ToastContainer autoClose={2000} closeOnClick />
    </Container>
  );
};

export default ForgotPassword;
