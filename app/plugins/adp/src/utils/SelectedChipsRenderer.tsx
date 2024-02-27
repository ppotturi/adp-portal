import React from 'react';
import { Box, Chip } from '@material-ui/core';

const SelectedChipsRenderer = ({ selected }) => {
  if (!Array.isArray(selected)) {
    return null; 
  }

  return (
    <Box display="flex" flexWrap="wrap">
      {selected.map((value) => (
        <Chip key={value} label={value} color="primary" size="small" />
      ))}
    </Box>
  );
};

export default SelectedChipsRenderer;

