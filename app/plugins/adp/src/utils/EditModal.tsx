import React, { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';

interface Field {
    label: string;
    name: string;
  }


interface EditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: ( data: Record<string, any>) => void;
  initialValues: Record<string, any>;
  fields: Field[];
}

export const EditModal: FC<EditModalProps> = ({ open, onClose, onSubmit,initialValues, fields }) => {
  const handleSubmit = () => {
    onSubmit(initialValues);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            defaultValue={initialValues[field.name]}
            fullWidth
            margin="dense"
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};


