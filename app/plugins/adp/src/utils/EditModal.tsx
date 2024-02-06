import React, { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';

interface ArmsLengthBody {
  id: string;
  timestamp: Date;
  creator: string;
  owner: string;
  name: string;
  short_name?: string;
  description: string;
  readonly title?: string;
}


interface EditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (armsLengthBody: ArmsLengthBody) => Promise<void>;
  initialValues: Record<string, any>;
  
  fields: {
    label: string;
    name: string;
    helperText?: string;
    validations?: {
      required?: boolean;
      maxLength?: number;
      pattern?: { 
        value: RegExp;
        message: string;
      };
    };
    multiline?: boolean;
    maxRows?: number;
  }[];
}

export const EditModal: FC<EditModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  fields,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialValues,
  });

  const onFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
    onClose();
  };

  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Edit: ${initialValues.name || 'Record'}`}</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          {fields.map(field => (
            <TextField
              key={field.name}
              id={field.name}
              label={field.label}
              variant="outlined"
              fullWidth
              margin="dense"
              {...register(field.name, {
                required: field.validations?.required
                  ? 'This field is required'
                  : undefined,
                maxLength: field.validations?.maxLength
                  ? {
                      value: field.validations.maxLength,
                      message: `Maximum length is ${field.validations.maxLength} characters`,
                    }
                  : undefined,
                  pattern: field.validations?.pattern ? {
                    value: field.validations.pattern.value,
                    message: field.validations.pattern.message,
                  } : undefined,
              })}
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message || field.helperText}
              multiline={field.multiline}
              maxRows={field.maxRows}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button type="submit"
            onClick={() => {
              reset(initialValues);
              onClose();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditModal;
