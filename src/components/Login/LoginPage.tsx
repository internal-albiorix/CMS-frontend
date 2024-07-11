import React, { useEffect, useState } from "react";
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
import { useNavigate, NavLink as RouterLink } from "react-router-dom";
import { getUserLogin } from "../../services/AuthenticationService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setSecureLocalStorage } from "../../helpers/SecureLocalStorage";
import { logOut } from "../../helpers/CheckAuth";
import Loader from "../../helpers/Loader";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    logOut();
    document.title = "Albiorix CMS";
  }, []);

  const getLoginDetail = async (value: any) => {
    const res = await getUserLogin(value);
    return res;
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Start loading
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const logindata = {
      Email: email,
      Password: password,
    };

    let res = await getLoginDetail(logindata);
    setLoading(false); // Start loading
    if (res?.statusCode === 200) {
      setSecureLocalStorage("token", res?.data?.token);
      setSecureLocalStorage("role", res?.data?.role.toString());
      setSecureLocalStorage("fullname", res?.data?.fullName);
      setSecureLocalStorage("userId", res?.data?.userId.toString());
      navigate("/dashboard");
    } else {
      toast.error(res.message);
    }
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
          Sign in
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              type="Email"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
            />
             <Button
            component={RouterLink}
            to="/forgot-password"
          >
            <i>
              <strong>Forgot Password?</strong>
            </i>
          </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#DE4948",
                ":hover": { backgroundColor: "#DE4948" },
              }}
            >
              {" "}
              Sign In{" "}
            </Button>
          </Box>
        </form>

        <div style={{ width: "100%", textAlign: "right", marginTop: "10px" }}>
          <Button
            component={RouterLink}
            to="/add-refer-employee"
            target="_blank"
          >
            <i>
              <strong>Refer Employee</strong>
            </i>
          </Button>
        </div>
      </Box>
      )}
      <ToastContainer autoClose={2000} closeOnClick />
    </Container>
  );
};
export default LoginPage;
