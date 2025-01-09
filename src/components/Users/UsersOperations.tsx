import {
  Button,
  IconButton,
  Grid,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Form, Formik } from "formik";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import TextInput from "../../common/Controls/TextInput";
import MultiSelectDropdown from "../../common/Controls/MultiSelectDropdown";
import SelectDropdown from "../../common/Controls/SelectDropdown";
import { insertUpdateUser, deleteUser } from "../../services/UserService";
import { userDataModel } from "../../models/UserModel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { rolesdropItems, statusdropItems } from "../../helpers/CommonData";
import { getSecureLocalStorage } from "../../helpers/SecureLocalStorage";
import ErrorMessage from "./../../common/Controls/ErrorMessage";

function UsersOperations(props: any) {
  const {
    model,
    initialValues,
    setModel,
    setSelectedUserData,
    getAllUsersData,
    designationData,
    technologyData,
  } = props;

  const onFormSubmit = async (values: userDataModel) => {
    let res;
    if (model.ops === "Save" || model.ops === "Update")
      res = await insertUpdateUser(values);
    else res = await deleteUser(values.id);

    if (res.success) {
      await getAllUsersData();
      handleModelClose();
      toast.success(res.message);
    } else toast.error("Something went wrong!!!");
  };

  const handleModelClose = () => {
    setModel({ open: false, ops: "" });
    setSelectedUserData({
      id: 0,
      fullName: "",
      mobileNumber: "",
      email: "",
      designationId: "",
      technologyIds: [],
      role: 0,
      status: "",
      password: "",
      confirmPassword: "",
    });
  };
  const roles = getSecureLocalStorage("role");
  const GetRoleMenuitems = (rolesmenu: any) => {
    if (roles != null && roles === "1") {
      return rolesmenu;
    } else {
      return rolesmenu.filter((item: any) => item.text !== "Admin");
    }
  };
  const validationSchema = yup.object().shape({
    fullName: yup.string().max(30).required("Full Name is required"),
    mobileNumber: yup
      .string()
      .matches(/^[0-9]+$/, "Invalid value")
      .length(10, "Invalid value")
      .required("Mobile No. is required"),
    email: yup.string().email().required("Email is required"),
    designationId: yup.string().required("Designation is required"),
    technologyIds: yup.array().min(1, "Minimum 1 technology required"),
    role: yup.number().oneOf(
      rolesdropItems.map((item) => item.value),
      "Please select a role"
    ),
    status: yup.string().required("Status is required"),
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
  debugger;
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onFormSubmit}
      enableReinitialize
    >
      {({ touched, errors }) => (
        <Form id={`${model.ops}Users`}>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {model.ops} Users
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
                <Grid item xs={12} sm={6}>
                  <TextInput label="Mobile No." name="mobileNumber" />
                  <ErrorMessage touched={touched.mobileNumber} errors={errors.mobileNumber} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput label="Email" name="email" />
                  <ErrorMessage touched={touched.email} errors={errors.email} />
                </Grid>
                <Grid item xs={12}>
                  <SelectDropdown
                    items={designationData}
                    label="Designation"
                    name="designationId"
                    valueField="value"
                  />
                  <ErrorMessage touched={touched.designationId} errors={errors.designationId} />
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
                <Grid item xs={12} sm={6}>
                  <SelectDropdown
                    items={GetRoleMenuitems(rolesdropItems)}
                    label="Role"
                    name="role"
                    valueField="value"
                  />
                  <ErrorMessage touched={touched.role} errors={errors.role} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectDropdown
                    items={statusdropItems}
                    label="Status"
                    name="status"
                    valueField="value"
                  />
                  <ErrorMessage touched={touched.status} errors={errors.status} />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                  />
                  <ErrorMessage touched={touched.password} errors={errors.password} />
                </Grid>

                <Grid item xs={12}>
                  <TextInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                  />
                  <ErrorMessage touched={touched.confirmPassword} errors={errors.confirmPassword} />
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

export default UsersOperations;
