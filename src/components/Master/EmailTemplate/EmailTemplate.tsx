import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Button, IconButton, Box, Switch } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Add from "@mui/icons-material/Add";
import DialogModal from "../../../common/Controls/Dialog";
import { ToastContainer, toast } from "react-toastify";
import Title from "../../../common/Title/TItle";
import "react-toastify/dist/ReactToastify.css";
import { EmailTemplateModel } from "../../../models/EmailTemplateModel";
import EmailTemplateOperations from "./EmailTemplateOperation";
import { getAllEmailTemplate, insertUpdateEmailTemplate } from "../../../services/EmailTemplateService";

const EmailTemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplateModel[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateModel | null>(null);
  const [pageSize, setPageSize] = useState(8);
  const [model, setModel] = useState<{ open: boolean; ops: string }>({
    open: false,
    ops: "",
  });

  useEffect(() => {
    getEmailTemplateData();
  }, []);

  const getEmailTemplateData = async () => {
    const { data, success } = await getAllEmailTemplate();
    if (success) setTemplates(data);
  };

  const handleAddNew = () => {
    setSelectedTemplate({ id: 0, templateName: "", templateType: "", templateContent: "", isActive: true });
    setModel({ open: true, ops: "Save" });
  };

  const handleEdit = (template: EmailTemplateModel) => {
    setSelectedTemplate(template);
    setModel({ open: true, ops: "Update" });
  };

  const handleDelete = (template: EmailTemplateModel) => {
    setSelectedTemplate(template);
    setModel({ open: true, ops: "Delete" });
  };

  const handleToggleActiveStatus = async (template: EmailTemplateModel) => {
    debugger
    const updatedTemplate = { ...template, isActive: template.isActive ? false : true };
    const { success } = await insertUpdateEmailTemplate(updatedTemplate);
    if (success) {
      toast.success("Template status updated successfully");
      getEmailTemplateData();
    } else {
      toast.error("Failed to update template status");
    }
  };

  const initialValues = selectedTemplate ? {
    id: selectedTemplate.id,
    templateName: selectedTemplate.templateName,
    templateType: selectedTemplate.templateType,
    templateContent: selectedTemplate.templateContent,
  } : {
    id: 0,
    templateName: "",
    templateType: "",
    templateContent: "",
  };

  const QuickSearchToolbar = () => {
    return (
      <Box sx={{ height: "45px" }}>
        <Button
          sx={{ float: "right" }}
          variant="contained"
          color="error"
          onClick={handleAddNew}
          startIcon={<Add />}
        >
          Add new
        </Button>
        <GridToolbarQuickFilter
          className="muiGridSearch"
          sx={{ float: "left", width: "50%" }}
        />
      </Box>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "templateName",
      headerName: "Template Name",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "templateContent",
      headerName: "Content",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "dataGridHeader",
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row as EmailTemplateModel)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row)}>
            <Delete />
          </IconButton>
          <Switch
            checked={params.row.isActive}
            onChange={() => handleToggleActiveStatus(params.row as EmailTemplateModel)}
            color="primary"
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <Title titleName="Email Template" />
      <DataGrid
        sx={{ p: 1 }}
        disableColumnMenu
        disableSelectionOnClick
        headerHeight={60}
        density="standard"
        rows={templates}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[8, 16, 24]}
        getRowId={(row) => row.id}
        components={{ Toolbar: QuickSearchToolbar }}
        autoHeight={true}
      />
      <DialogModal modelOps={model} setModelOps={setModel} maxwithValue="md">
        <EmailTemplateOperations
          model={model}
          initialValues={initialValues}
          setModel={setModel}
          setSelectedTemplateData={setSelectedTemplate}
          getEmailTemplateData={getEmailTemplateData}
        />
      </DialogModal>
      <ToastContainer autoClose={2000} closeOnClick />
    </div>
  );
};

export default EmailTemplateManager;
