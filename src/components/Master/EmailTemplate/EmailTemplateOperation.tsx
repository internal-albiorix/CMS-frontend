import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, IconButton, Grid, Typography, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SelectDropdown from "../../../common/Controls/SelectDropdown";
import TextInput from "../../../common/Controls/TextInput";
import ErrorMessage from "../../../common/Controls/ErrorMessage";
import { insertUpdateEmailTemplate,deleteEmailTemplate } from "../../../services/EmailTemplateService";

import { EmailTemplateModel } from "../../../models/EmailTemplateModel";
import { emailtemplatedropItems } from "../../../helpers/CommonData";

const EmailTemplateOperations = (props: any) => {
  const { model, initialValues, setModel, setSelectedTemplateData, getEmailTemplateData } = props;

  const handleModelClose = () => {
    setModel({ open: false, ops: "" });
    setSelectedTemplateData({ id: 0, templateName: "",templateType:"", templateContent: "" });
  };

  const validationSchema = yup.object().shape({
    templateName: yup.string().max(50).required("Template name is required"),
    templateType: yup.string().required("Template type is required"),
    templateContent: yup.string().required("Template content is required"),
  });

  const onFormSubmit = async (values: EmailTemplateModel) => {
    let res;
    if (model.ops === "Save" || model.ops === "Update") {
       res = await insertUpdateEmailTemplate(values);
    } else {
       res = await deleteEmailTemplate(values.id);
    }

    if (res.success) {
      await getEmailTemplateData();
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
      {({ setFieldValue, touched, errors }) => (
        <Form id={`${model.ops}EmailTemplate`}>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {model.ops} Email Template
            <IconButton
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={handleModelClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {model.ops !== "Delete" ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextInput label="Template Name" name="templateName" />
                  <ErrorMessage touched={touched.templateName} errors={errors.templateName} />
                </Grid>
                <Grid item xs={12}>
                <SelectDropdown
                  items={emailtemplatedropItems}
                  label="Template Type"
                  name="templateType"
                  valueField="value"
                />
                <ErrorMessage touched={touched.templateType} errors={errors.templateType} />
              </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" component="label" gutterBottom>
                    Template Content:
                  </Typography>
                  <CKEditor
                    editor={ClassicEditor}
                    data={initialValues.templateContent}
                    onChange={(event, editor) => {
                      setFieldValue("templateContent", editor.getData());
                    }}
                  />
                </Grid>
              </Grid>
            ) : (
              <Typography gutterBottom>
                Are you sure you want to delete this template?
              </Typography>
            )}
          </DialogContent>

          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleModelClose}>
              Cancel
            </Button>
            {model.ops !== "Delete" ? (
              <Button variant="contained" color="error" startIcon={<SaveIcon />} type="submit">
                {model.ops}
              </Button>
            ) : (
              <Button variant="contained" color="error" startIcon={<DeleteIcon />} type="submit">
                {model.ops}
              </Button>
            )}
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default EmailTemplateOperations;
