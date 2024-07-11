import React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  InputLabel,
  FormHelperText,
  MenuItem,
  Checkbox,
  OutlinedInput,
  ListItemText,
  FormControl,
} from "@mui/material";
import { useField } from "formik";

function MultiSelectDropdown(props: any) {
  const { items, label, valueField, ...rest } = props;
  const [field, meta, helper] = useField(props);
  const { value } = field;
  const selectedValue = value || [];
  const isError = meta.touched && meta.error && true;
  const { setValue } = helper;
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setValue(typeof value === "string" ? value.split(",") : value);
  };

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
        {...field}
        multiple
        value={selectedValue}
        onChange={handleChange}
        MenuProps={MenuProps}
        input={<OutlinedInput label={label} />}
        renderValue={(selectedValue) => {
          let selectedList;
          selectedList = selectedValue.map((id: any) => {
            return items.find((x: any) => x.key == id)?.value;
          });
          return selectedList.toString();
        }}
      >
        {items.map((data: any) => (
          <MenuItem key={data.key} value={data.key}>
            <Checkbox checked={selectedValue.indexOf(data.key) > -1} />
            <ListItemText primary={data.value} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MultiSelectDropdown;
