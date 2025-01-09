import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import TextInput from "../../../common/Controls/TextInput";
import ErrorMessage from "../../../common/Controls/ErrorMessage";
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
  deleteDesignation,
  insertUpdateDesignation,
} from "../../../services/DesignationService";
import { designationDataModel } from "../../../models/DesignationModel";

function designationOperations(props: any) {
  const {
    model,
    initialValues,
    setModel,
    setSelectedDesignationData,
    getDesignationData,
  } = props;
  const handleModelClose = () => {
    setModel({ open: false, ops: "" });
    setSelectedDesignationData({
      id: 0,
      designationName: "",
      designationDescription: "",
    });
  };

  const validationSchema = yup.object().shape({
    designationName: yup.string().max(30).required("Designation name required"),
    designationDescription: yup
      .string()
      .max(30)
      .required("Designation description required"),
  });

  const onFormSubmit = async (values: designationDataModel) => {
    let res;
    if (model.ops === "Save" || model.ops === "Update")
      res = await insertUpdateDesignation(values);
    else res = await deleteDesignation(values.id);

    if (res.success) {
      await getDesignationData();
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
      {({ touched, errors }) => (
        <Form id={`${model.ops}Designation`}>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {model.ops} Designation
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
                  <TextInput label="Designation Name" name="designationName" />
                  <ErrorMessage touched={touched.designationName} errors={errors.designationName} />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    label="Designation Description"
                    name="designationDescription"
                  />
                  <ErrorMessage touched={touched.designationDescription} errors={errors.designationDescription} />
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

export default designationOperations;
