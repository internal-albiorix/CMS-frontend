import React from 'react'
import { TextField } from '@mui/material'
import { useField } from 'formik'

//Common component of textfield with formik wrapper
function TextInput(props: any) {
    const [field, meta] = useField(props);

    function renderHelperText() {
        if (meta.touched && meta.error)
            return meta.error;
    }

    return (
        <TextField fullWidth variant="outlined"
            error={meta.touched && meta.error && true}
            // helperText={renderHelperText()}
            {...field} {...props}
        />
    )
}

export default TextInput