import React,{ FC, useState} from 'react';
import { Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Chip,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import SelectedChipsRenderer from './SelectedChipsRenderer';

interface ActionsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialValues: Record<string, any>;
  mode: 'create' | 'edit';
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
    select?: boolean;
    multiple?: boolean;
    options?: { label: string; value: string }[];
  }[];
}

export const ActionsModal: FC<ActionsModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  mode,
  fields,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialValues,
  });




  const onFormSubmit = async (data: { programme_managers: any[]; }) => {
 
    const formattedProgrammeManagers = data.programme_managers.map(manager => {
      return { aad_entity_ref_id: manager };
  });

  console.log(formattedProgrammeManagers)

    
    const finalData = {
        ...data,
        programme_managers: formattedProgrammeManagers,
    };

    console.log('Final form submit data:', finalData);

    try {
        await onSubmit(finalData); 
        reset(); 
        onClose(); 
    } catch (e) {
        console.error(e);
       
    }
};




console.log("inital values", initialValues)


  const renderTextField = (field: any) => (
    <TextField
      key={field.name}
      id={field.name}
      label={field.label}
      variant="outlined"
      fullWidth
      margin="dense"
      {...register(field.name, {
        required: field.validations?.required ? 'This field is required' : undefined,
        maxLength: field.validations?.maxLength
          ? {
              value: field.validations.maxLength,
              message: `Maximum length is ${field.validations.maxLength} characters`,
            }
          : undefined,
        pattern: field.validations?.pattern
          ? {
              value: field.validations.pattern.value,
              message: field.validations.pattern.message,
            }
          : undefined,
      })}
      defaultValue={initialValues[field.name] || ''}
      error={!!errors[field.name]}
      helperText={errors[field.name]?.message ?? field.helperText}
      multiline={field.multiline}
      maxRows={field.maxRows}
    />
  );



  
  const renderSelectField = (field: any) => (
    
    <TextField
      key={field.name}
      id={field.name}
      label={field.label}
      variant="outlined"
      fullWidth
      margin="dense"
      select
      SelectProps={{
        multiple: field.multiple,
        renderValue: field.multiple ? (selected) => <SelectedChipsRenderer selected={selected || []} options={field.options}/> : undefined,
      }}
      {...register(field.name, {
        required: field.validations?.required ? 'This field is required' : undefined,
        maxLength: field.validations?.maxLength
          ? {
              value: field.validations.maxLength,
              message: `Maximum length is ${field.validations.maxLength} characters`,
            }
          : undefined,
        pattern: field.validations?.pattern
          ? {
              value: field.validations.pattern.value,
              message: field.validations.pattern.message,
            }
          : undefined,
      })}
      defaultValue={field.multiple ? initialValues[field.name]?.map((item: any) => item.aad_entity_ref_id) : initialValues[field.name] || ''}
      error={!!errors[field.name]}
      helperText={errors[field.name]?.message ?? field.helperText}
    >
      {field.options?.map((option:any) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );

  // const renderSelectField = (field: any) => {
  //   const [selectedValue, setSelectedValue] = useState(() => 
  //     field.multiple ? initialValues[field.name]?.map((item: any) => item.aad_entity_ref_id) : initialValues[field.name] || ''
  //   );
  
  //   const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //     setSelectedValue(event.target.value);
  //   };
  
  //   return (
  //     <TextField
  //       key={field.name}
  //       id={field.name}
  //       label={field.label}
  //       variant="outlined"
  //       fullWidth
  //       margin="dense"
  //       select
  //       SelectProps={{
  //         multiple: field.multiple,
  //         value: selectedValue,
  //         onChange: handleChange,
  //         renderValue: selected => <SelectedChipsRenderer selected={selected || []} options={field.options} />,
  //       }}
  //       {...register(field.name)}
  //       error={!!errors[field.name]}
  //       helperText={errors[field.name]?.message ?? field.helperText}
  //     >
  //       {field.options.map((option: any) => (
  //         <MenuItem key={option.value} value={option.value}>
  //           {option.label}
  //         </MenuItem>
  //       ))}
  //     </TextField>
  //   );
  // };
  
  
  
  return (
    <Dialog open={open} onClose={onClose} >
      <DialogTitle>{`${mode === 'edit' ? 'Edit' : 'Create'}: ${initialValues.title || ''}`}</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          {fields.map((field) => (
            field.select ? (
              renderSelectField(field)
            ) : (
              renderTextField(field)
            )
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              reset(initialValues);
              onClose();
            }}
            color="primary"
            data-testid="actions-modal-cancel-button"
          >
            Cancel
          </Button>
          <Button type="submit" color="primary" data-testid="actions-modal-update-button">
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};


