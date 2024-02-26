export const DeliveryProgrammeFormFields = [
  {
    label: 'Title',
    name: 'title',
    helperText: 'This must be unique',
    validations: {
      required: true,
      pattern: {
        value: /^[a-zA-Z0-9]+(?:[. ][a-zA-Z0-9]+)*$/,
        message: 'Invalid Delivery Programme name format',
      },
    },
  },
  {
    label: 'Alias',
    name: 'alias',
    helperText: 'Optional - an alias to identify the body',
  },
  {
    label: 'Website',
    name: 'url',
    helperText: 'Optional - a link to website',
  },
  {
    label: 'Arms Length Body',
    name: 'arms_length_body',
    select: true,
    options: [ { label: 'Option 1 Label', value: 'option1value' },
    { label: 'Option 2 Label', value: 'option2value' }
  ]
  },

  {
    label: 'Programme Managers',
    name: 'programme_manager',
    select: true,
    options: [ { label: 'Option 1 Label', value: 'option1value' },
    { label: 'Option 2 Label', value: 'option2value' }]
    
  },

  {
    label: 'Finance Code',
    name: 'finance_code',
  },
  {
    label: 'Delivery Programme Code',
    name: 'delivery_programme_code',
  },

  {
    label: 'Delivery Programme Description',
    name: 'description',
    helperText: 'Max 200 Chars',
    validations: {
      required: true,
      maxLength: 200,
    },
    multiline: true,
    maxRows: 4,
  },
];
