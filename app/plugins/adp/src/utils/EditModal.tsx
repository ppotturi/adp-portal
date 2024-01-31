import React, { FC, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
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

export const EditModal: FC<EditModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  fields,
  titleData,
}) => {
  const [formValues, setFormValues] = useState(initialValues.id);

  const handleFieldChange = (name: string, value: any) => {
    setFormValues((prevValues: any) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit({ ...formValues, id: initialValues.id });
    setFormValues({});
    onClose();
  };

  const handleCancel = () => {
    setFormValues({});
    onClose();
  };

  const getTitle = () =>
    titleData && titleData.name ? `Edit ${titleData.name}` : '';

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        {fields.map(field => (
          <TextField
            key={field.name}
            label={field.label}
            defaultValue={initialValues[field.name] || ''}
            onChange={e => handleFieldChange(field.name, e.target.value)}
            fullWidth
            margin="dense"
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
