import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useField } from "formik";
import { toast } from "react-toastify";

function UploadFile(props: any) {
  const { setFieldValue, setFileName, fileName } = props;
  const [field, meta] = useField(props);

  // function renderHelperText() {
  //   if (meta.touched && meta.error)
  //     return meta.error;
  // }

  function handleUploadChange(event: any) {
    if (event.currentTarget.files) {
      const selectedFile = event.currentTarget.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]; // Allowed file types: PDF, DOC, DOCX
      const maxSize = 5 * 1024 * 1024; // 5MB

      // Check file type and size
      if (
        allowedTypes.includes(selectedFile.type) &&
        selectedFile.size <= maxSize
      ) {
        setFieldValue("resumeFile", selectedFile);
        setFileName(selectedFile.name);
      } else {
        // Reset the input and show an error message if the file doesn't meet requirements
        event.target.value = null;
        toast.error("Please upload a PDF or Word file (up to 5MB).");
      }
    }
  }

  const SearchButton = () => (
    <Button variant="contained" component="label">
      Upload
      <input
        hidden
        onChange={handleUploadChange}
        type="file"
        accept=".pdf,.doc,.docx"
      />
    </Button>
  );

  return (
    <TextField
      placeholder="Upload resume"
      {...field}
      {...props.fields}
      value={fileName}
      error={meta.touched && meta.error && true}
      InputProps={{ endAdornment: <SearchButton /> }}
      fullWidth
    />
  );
}

export default UploadFile;
