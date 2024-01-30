import React, { FC, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';
import { ArmsLengthBody } from '@internal/plugin-adp-backend';


interface Field {
  label: string;
  name: string;
}


interface EditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (armsLengthBody: ArmsLengthBody) => void;
  initialValues: Record<string, any>;
  fields: Field[];
  titleData: Record<string, any>;
}

export const EditModal: FC<EditModalProps> = ({ open, onClose, onSubmit, initialValues, fields, titleData }) => {
  const [formValues, setFormValues] = useState(initialValues.id);

  const handleFieldChange = (name: string, value: any) => {
    console.log('Before Update:', formValues);
    setFormValues((prevValues: any) => {
      const updatedValues = { ...prevValues, [name]: value };
      console.log('After Update:', updatedValues);
      return updatedValues;
    });
  };



  const handleSubmit = () => {
    console.log('Submitting:', formValues);
    console.log('Submittingid:', initialValues.id);
  
    onSubmit({ ...formValues, id: initialValues.id });;
    onClose();
  };

  const getTitle = () => {
    if (titleData && titleData.name) {
      return `Edit ${titleData.name}`;
    }
    return '';
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <TextField
            key={field.name}
            label={field.label}
            defaultValue={initialValues[field.name] || ""}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
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



