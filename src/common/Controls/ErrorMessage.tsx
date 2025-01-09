import React from 'react';

interface ErrorMessageProps {
  touched:  any;
  errors: any;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ touched, errors }) => {
  return (
    <> 
      {touched && errors && (
        <div style={{ color: 'red', fontSize: '12px' }}>
          {errors}
        </div>
      )}
    </>
  );
};

export default ErrorMessage;
