import React from "react";
import { Dialog } from "@mui/material";

interface DialogReceiveProps {
  modelOps: { open: boolean; ops: string };
  setModelOps: (modelOps: { open: boolean; ops: string }) => void;
  children: React.ReactNode;
  maxwithValue?: any;
}

const DialogModal: React.FC<DialogReceiveProps> = ({
  modelOps,
  setModelOps,
  children,
  maxwithValue,
}) => {
  const { open, ops } = modelOps;
  const handleClose = () => {
    setModelOps({ open: false, ops: "" });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth={maxwithValue}>
      {children}
    </Dialog>
  );
};

export default DialogModal;
