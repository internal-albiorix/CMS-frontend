import React from "react";
import Select from "@mui/material/Select";
import {
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { useField } from "formik";
function SelectDropdown(props: any) {
  const { items, label, valueField, showField, ...rest } = props;
  const [field, meta] = useField(props);
  const { value: selectedValue } = field;
  const isError = meta.touched && meta.error && true;
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <FormControl {...rest} error={isError} fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        {...field}
        value={selectedValue ? selectedValue : ""}
        MenuProps={MenuProps}
      >
        {items.map((data: any) => (
          <MenuItem key={data.key} value={data.key}>
            {data.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
export default SelectDropdown;
