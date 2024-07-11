import React from 'react';
import { ClipLoader } from 'react-spinners';
import { Box } from '@mui/material';


const Loader: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Ensure the loader appears on top of other content
        animation: 'fadeIn 0.3s forwards', // Example animation
      }}
    >
      <ClipLoader color="#DE4948" size={50} />
    </Box>
  );
};

export default Loader;
