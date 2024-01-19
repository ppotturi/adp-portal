import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
  TableColumn,
} from '@backstage/core-components';
import { DefaultTable } from '../../utils/Table';
import { EditModal } from '../../utils/EditModal';

export const AlbViewPageComponent = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});


  const handleEdit = (ArmsLengthBody: React.SetStateAction<{}>) => {
    setFormData(ArmsLengthBody);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({});
  };

  const handleCrudSubmit = (data: Record<string, any>) => {
    //update database
    //get timestamp 
    //refresh display - through state 
    console.log('Performing action with data:', data);
    handleCloseModal();
  };


  const columns: TableColumn[] = [
    {
      title: 'Name',
      field: 'col1',
      highlight: true,
      type: 'string',
    },
    {
      title: 'Short-Form Name',
      field: 'col2',
      highlight: true,
      type: 'string',
    },
    {
      title: 'Owner',
      field: 'col3',
      highlight: true,
      type: 'string',
    },
    {
      title: 'Last Edit',
      field: 'date',
      highlight: false,
      type: 'date',
    },

    {
      title: 'Action',
      render: ArmsLengthBody => {
        return (
          <Button variant="contained" color="primary" onClick={() => handleEdit(ArmsLengthBody)}>
            Edit
          </Button>
        )
      }

    },
  ];

  const testData10 = Array.from({ length: 7 }, (_, index) => ({
    col1: `ALB-Name-${index}`,
    col2: `Short-Form-Name_${index}`,
    col3: `Owner_Name${index}`,
    date: new Date(Math.abs(Math.sin(index)) * 10000000000000),
  }));

  return (
    <Page themeId="tool">
      <Header title="Azure Development Platform: Data" subtitle="ADP Data" />
      <Content>
        <ContentHeader title="Arms Length Bodies">
          <SupportButton>
            View or manage units within the DEFRA delivery organization on the
            Azure Developer Platform.
          </SupportButton>
        </ContentHeader>
        <Typography paragraph>
          View or add Arms Length Bodies to the Azure Developer Platform.
        </Typography>
        <DefaultTable data={testData10} columns={columns} title="View all" />

        <EditModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCrudSubmit}
          initialValues={formData}
          fields={[
            { label: 'Owner Name', name: 'customField1' },
            { label: 'Owner Email', name: 'customField2' },
            { label: 'ALB Name', name: 'customField3' },
            { label: 'Short-Form Name', name: 'customField4' },
            { label: 'ALB Description', name: 'customField5' },

          ]} />

      </Content>
    </Page>
  );
};
